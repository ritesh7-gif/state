import React, { useState } from 'react';
import { Copy, Megaphone, Check, Image as ImageIcon, Download, RefreshCw, CheckCircle, Maximize2, X } from 'lucide-react';

const MarketingCard = ({ payload, onAction }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [publishSuccessMessage, setPublishSuccessMessage] = useState("");

  if (!payload || !payload.sections) return null;
  
  const reviewSections = payload.sections.filter(sec => 
    sec.heading.toLowerCase().includes('instagram') || 
    sec.heading.toLowerCase().includes('caption') ||
    sec.heading.toLowerCase().includes('social')
  );
  const sectionsToRender = reviewSections.length > 0 ? reviewSections : payload.sections;
  
  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      } catch (e) {
         console.error('Fallback copy failed: ', e);
      }
    }
  };

  const handleDownload = () => {
    if (payload.image_url) {
      fetch(payload.image_url)
        .then(response => response.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = `marketing-creative-${Date.now()}.jpg`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        })
        .catch(err => {
            const a = document.createElement('a');
            a.target = '_blank';
            a.href = payload.image_url;
            a.download = `marketing-creative.jpg`;
            a.click();
        });
    }
  };

  const handleRegenerate = () => {
    if (onAction) {
       onAction(`Regenerate marketing image for the campaign: ${payload.title || "Sky Heights"}`);
    }
  };
  
  return (
    <>
      <div className="ew-marketing-card" style={{
        background: 'var(--surface-50)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '20px',
        marginTop: '16px',
        fontFamily: 'var(--font-sans)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
          <Megaphone size={20} color="var(--accent)" />
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
            {payload.title || "Marketing Campaign"}
          </h3>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {payload.sections.map((sec, i) => (
            <div key={i} style={{ background: 'var(--surface-100)', borderRadius: '8px', padding: '16px', position: 'relative' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {sec.heading}
              </h4>
              <div style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {sec.content}
              </div>
              {sec.tags && sec.tags.length > 0 && (
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {sec.tags.map((tag, j) => (
                    <span key={j} style={{ background: 'var(--bg-hover)', color: 'var(--accent)', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <button 
                onClick={() => handleCopy(sec.content + (sec.tags && sec.tags.length > 0 ? '\n\n' + sec.tags.join(' ') : ''), i)}
                style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: copiedIndex === i ? '#10b981' : 'var(--text-secondary)' }}
                title="Copy to clipboard"
                className="ew-icon-btn"
              >
                {copiedIndex === i ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          ))}
        </div>
        
        {payload.image_url && (
          <div style={{ marginTop: '24px' }}>
            {publishSuccessMessage && (
              <div style={{ padding: '12px', background: '#d1fae5', color: '#065f46', borderRadius: '6px', marginBottom: '16px', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #10b981' }}>
                <CheckCircle size={16} />
                {publishSuccessMessage}
              </div>
            )}
            
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ImageIcon size={16} /> Generated Marketing Creative
            </h4>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', background: 'var(--surface-100)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              {/* Preview Image Column */}
              <div style={{ flex: '1 1 300px', maxWidth: '350px', position: 'relative', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border)', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={payload.image_url} alt="Creative Preview" style={{ width: '100%', display: 'block', objectFit: 'contain' }} />
                <button 
                  onClick={() => setIsModalOpen(true)}
                  style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Expand Preview"
                >
                  <Maximize2 size={16} />
                </button>
              </div>

              {/* Metadata & Actions Column */}
              <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                    <span style={{ fontWeight: 600, color: isPublished ? '#10b981' : '#f59e0b' }}>
                      {isPublished ? 'Published' : 'Ready for Review'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Format:</span>
                    <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Instagram Post</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Resolution:</span>
                    <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>1080 × 1080</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => setIsModalOpen(true)} style={{ flex: 1, padding: '8px', background: 'var(--surface-200)', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                      <Maximize2 size={14} /> Preview
                    </button>
                    <button onClick={handleDownload} style={{ flex: 1, padding: '8px', background: 'var(--surface-200)', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                      <Download size={14} /> Download
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={handleRegenerate} style={{ flex: 1, padding: '8px', background: 'var(--surface-200)', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                      <RefreshCw size={14} /> Regenerate
                    </button>
                    <button onClick={() => setIsReviewModalOpen(true)} disabled={isPublished} style={{ flex: 1, padding: '8px', background: isPublished ? 'rgba(16, 185, 129, 0.1)' : 'var(--accent)', border: 'none', borderRadius: '6px', cursor: isPublished ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', color: isPublished ? '#10b981' : '#fff', fontWeight: 500 }}>
                      <CheckCircle size={14} /> {isPublished ? 'Published' : 'Approve'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full-size Image Modal */}
      {isModalOpen && payload.image_url && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }} onClick={() => setIsModalOpen(false)}>
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: '-40px', right: 0, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500 }}
            >
              Close <X size={20} />
            </button>
            <img 
              src={payload.image_url} 
              alt="Full Resolution Creative" 
              style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2)' }} 
            />
          </div>
        </div>
      )}

      {/* Publishing Review Modal */}
      {isReviewModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }} onClick={() => setIsReviewModalOpen(false)}>
          <div style={{ background: '#1e1e1e', width: '100%', maxWidth: '800px', maxHeight: '90vh', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.1)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#252526' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={18} color="#10b981" /> Publishing Review
              </h3>
              <button onClick={() => setIsReviewModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {payload.image_url && (
                  <img src={payload.image_url} alt="Review Creative" style={{ width: '100%', borderRadius: '8px', border: '1px solid var(--border)' }} />
                )}
              </div>
              <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: '#2d2d2d', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Post Content</h4>
                  {sectionsToRender.map((sec, i) => (
                    <div key={i} style={{ marginBottom: i < payload.sections.length - 1 ? '16px' : 0 }}>
                      <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#e5e7eb', whiteSpace: 'pre-wrap' }}>
                        {sec.content}
                      </div>
                      {sec.tags && sec.tags.length > 0 && (
                        <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {sec.tags.map((tag, j) => (
                            <span key={j} style={{ color: '#3b82f6', fontSize: '13px' }}>
                              {tag.startsWith('#') ? tag : `#${tag}`}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
              </div>
            </div>
            
            <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: '#1e1e1e' }}>
              <button 
                onClick={() => setIsReviewModalOpen(false)} 
                style={{ padding: '8px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: '#e5e7eb' }}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setIsPublished(true);
                  setPublishSuccessMessage("Successfully published to Instagram.");
                  setIsReviewModalOpen(false);
                }} 
                style={{ padding: '8px 20px', background: 'var(--accent)', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: '#fff' }}
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MarketingCard;
