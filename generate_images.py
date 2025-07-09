
from PIL import Image
import os

# アイテムの色の定義 (script.jsから持ってくる)
item_colors = [
    {'group': 1, 'color': '#ff6b6b'},
    {'group': 1, 'color': '#f06595'},
    {'group': 1, 'color': '#cc5de8'},
    {'group': 1, 'color': '#845ef7'},
    {'group': 2, 'color': '#5c7cfa'},
    {'group': 2, 'color': '#339af0'},
    {'group': 2, 'color': '#22b8cf'},
    {'group': 2, 'color': '#20c997'},
    {'group': 3, 'color': '#51cf66'},
    {'group': 3, 'color': '#94d82d'},
    {'group': 3, 'color': '#fcc419'},
    {'group': 3, 'color': '#ff922b'},
    {'group': 4, 'color': '#adb5bd'},
    {'group': 4, 'color': '#868e96'},
    {'group': 4, 'color': '#495057'},
    {'group': 4, 'color': '#ced4da'},
]

# 保存先ディレクトリ
output_dir = 'images'
os.makedirs(output_dir, exist_ok=True)

# 画像サイズ
width, height = 100, 100

# 各色に対応する画像を生成
for i, item in enumerate(item_colors):
    img = Image.new('RGB', (width, height), color=item['color'])
    # ファイル名は script.js の id に合わせる
    file_path = os.path.join(output_dir, f"group{item['group']}-item{i}.png")
    img.save(file_path)

print(f'{len(item_colors)}個の画像を {output_dir} に生成しました。')
