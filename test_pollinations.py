import os
from openai import OpenAI

def test():
    client = OpenAI(
        api_key="sk_deeX31q8V5Iau1rV5Dg2DwonOdijjotK",
        base_url="https://image.pollinations.ai/"
    )
    try:
        response = client.images.generate(
            model="flux",
            prompt="A modern luxury villa with a swimming pool, at sunset",
            n=1,
            size="1024x1024"
        )
        print("Success! URL:", response.data[0].url)
    except Exception as e:
        print("Failed!", e)

test()
