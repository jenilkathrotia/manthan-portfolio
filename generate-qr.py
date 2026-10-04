from pathlib import Path
import qrcode
import qrcode.image.svg
import zxingcpp
from PIL import Image

URL = 'https://jenilkathrotia.github.io/manthan-portfolio/'
assets = Path(__file__).parent / 'assets'
qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_Q, box_size=30, border=4)
qr.add_data(URL)
qr.make(fit=True)
qr.make_image(fill_color='#2D302E', back_color='#FAF8F3').save(assets / 'portfolio-qr.png')
qr.make_image(image_factory=qrcode.image.svg.SvgPathFillImage).save(assets / 'portfolio-qr.svg')
result = zxingcpp.read_barcode(Image.open(assets / 'portfolio-qr.png'))
assert result and result.text == URL
print(f'QR verified: {result.text}')
