from PIL import Image
import os

# アイテムの色の定義 (高級感のある明るいトーン)
item_colors = [
    {'group': 1, 'color': '#F0E68C'}, # Khaki (Light Gold)
    {'group': 1, 'color': '#DAA520'}, # Goldenrod (Deeper Gold)
    {'group': 1, 'color': '#B8860B'}, # DarkGoldenrod (Rich Gold)
    {'group': 1, 'color': '#FFD700'}, # Gold (Bright Gold)

    {'group': 2, 'color': '#E6E6FA'}, # Lavender (Soft Purple)
    {'group': 2, 'color': '#DDA0DD'}, # Plum (Muted Purple)
    {'group': 2, 'color': '#BA55D3'}, # MediumOrchid (Vibrant Purple)
    {'group': 2, 'color': '#9932CC'}, # DarkOrchid (Deep Purple)

    {'group': 3, 'color': '#ADD8E6'}, # LightBlue (Soft Blue)
    {'group': 3, 'color': '#87CEEB'}, # SkyBlue (Clear Blue)
    {'group': 3, 'color': '#6495ED'}, # CornflowerBlue (Medium Blue)
    {'group': 3, 'color': '#4682B4'}, # SteelBlue (Muted Blue)

    {'group': 4, 'color': '#90EE90'}, # LightGreen (Soft Green)
    {'group': 4, 'color': '#3CB371'}, # MediumSeaGreen (Muted Green)
    {'group': 4, 'color': '#2E8B57'}, # SeaGreen (Deep Green)
    {'group': 4, 'color': '#006400'}, # DarkGreen (Rich Green)
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