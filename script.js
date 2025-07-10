document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('main-canvas');
    const ctx = canvas.getContext('2d');
    const canvasContainer = document.getElementById('canvas-container');
    const itemGroupsContainer = document.getElementById('item-groups');
    const saveButton = document.getElementById('save-button');
    const zoomSlider = document.getElementById('zoom-slider');

    function resizeCanvas() {
        const rect = canvasContainer.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        drawCanvas();
    }

    const itemData = [
        { group: 1, label: 'アイテム 1', imagePath: 'images/group1-item0.png' },
        { group: 1, label: 'アイテム 2', imagePath: 'images/group1-item1.png' },
        { group: 1, label: 'アイテム 3', imagePath: 'images/group1-item2.png' },
        { group: 1, label: 'アイテム 4', imagePath: 'images/group1-item3.png' },
        { group: 2, label: 'アイテム 1', imagePath: 'images/group2-item4.png' },
        { group: 2, label: 'アイテム 2', imagePath: 'images/group2-item5.png' },
        { group: 2, label: 'アイテム 3', imagePath: 'images/group2-item6.png' },
        { group: 2, label: 'アイテム 4', imagePath: 'images/group2-item7.png' },
        { group: 3, label: 'アイテム 1', imagePath: 'images/group3-item8.png' },
        { group: 3, label: 'アイテム 2', imagePath: 'images/group3-item9.png' },
        { group: 3, label: 'アイテム 3', imagePath: 'images/group3-item10.png' },
        { group: 3, label: 'アイテム 4', imagePath: 'images/group3-item11.png' },
        { group: 4, label: 'アイテム 1', imagePath: 'images/group4-item12.png' },
        { group: 4, label: 'アイテム 2', imagePath: 'images/group4-item13.png' },
        { group: 4, label: 'アイテム 3', imagePath: 'images/group4-item14.png' },
        { group: 4, label: 'アイテム 4', imagePath: 'images/group4-item15.png' },
    ];

    let canvasItems = [];
    let activeCanvasItem = null; // キャンバスで選択中のアイテム
    let isDragging = false;
    let offsetX, offsetY;

    function createSelectionUI() {
        const groups = {};
        itemData.forEach(item => {
            if (!groups[item.group]) { groups[item.group] = []; }
            groups[item.group].push(item);
        });

        itemGroupsContainer.innerHTML = '';

        for (const groupNum in groups) {
            const group = groups[groupNum];
            const groupDiv = document.createElement('div');
            groupDiv.className = 'item-group';
            groupDiv.innerHTML = `<h3>アイテムグループ ${groupNum}</h3>`;
            const itemListDiv = document.createElement('div');
            itemListDiv.className = 'item-list';
            
            group.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'item';
                itemDiv.dataset.itemId = item.id;
                itemDiv.style.backgroundImage = `url(${item.image.src})`;
                itemDiv.addEventListener('click', () => selectItem(item, itemDiv));
                itemListDiv.appendChild(itemDiv);
            });

            groupDiv.appendChild(itemListDiv);
            itemGroupsContainer.appendChild(groupDiv);
        }
    }

    function selectItem(item, itemDiv) {
        const allItemsInGroup = itemGroupsContainer.querySelectorAll(`.item[data-item-id*="group${item.group}"]`);
        allItemsInGroup.forEach(div => div.classList.remove('selected'));
        itemDiv.classList.add('selected');

        const existingItemIndex = canvasItems.findIndex(ci => ci.group === item.group);
        const newItem = {
            ...item,
            width: 100,
            height: 100,
            scale: 1,
            zIndex: item.group
        };

        if (existingItemIndex !== -1) {
            const oldItem = canvasItems[existingItemIndex];
            newItem.x = oldItem.x;
            newItem.y = oldItem.y;
            newItem.scale = oldItem.scale; // スケールを維持
            newItem.width = 100 * newItem.scale;
            newItem.height = 100 * newItem.scale;
            canvasItems[existingItemIndex] = newItem;
        } else {
            newItem.x = 50 + (canvasItems.length * 30) % (canvas.width - 150);
            newItem.y = 50 + (canvasItems.length * 30) % (canvas.height - 150);
            canvasItems.push(newItem);
        }
        setActiveCanvasItem(newItem);
        drawCanvas();
    }

    function drawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvasItems.sort((a, b) => a.zIndex - b.zIndex);
        canvasItems.forEach(item => {
            if (item.image && item.image.complete) {
                ctx.drawImage(item.image, item.x, item.y, item.width, item.height);
                // アクティブなアイテムに枠線を描画
                if (item === activeCanvasItem) {
                    ctx.strokeStyle = '#B8860B'; // Gold color for luxury theme
                    ctx.lineWidth = 2;
                    ctx.strokeRect(item.x, item.y, item.width, item.height);
                }
            }
        });
    }

    // 保存用のキャンバス描画 (選択枠なし)
    function drawCanvasForSave() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvasItems.sort((a, b) => a.zIndex - b.zIndex);
        canvasItems.forEach(item => {
            if (item.image && item.image.complete) {
                ctx.drawImage(item.image, item.x, item.y, item.width, item.height);
            } else {
                // 画像が読み込まれていない場合はエラーログを出力
                console.error(`保存時に画像が読み込まれていません: ${item.imagePath}`);
            }
        });
    }

    function setActiveCanvasItem(item) {
        activeCanvasItem = item;
        if (item) {
            zoomSlider.disabled = false;
            zoomSlider.value = item.scale;
        } else {
            zoomSlider.disabled = true;
        }
        drawCanvas();
    }

    canvas.addEventListener('mousedown', (e) => {
        const mouseX = e.clientX - canvas.getBoundingClientRect().left;
        const mouseY = e.clientY - canvas.getBoundingClientRect().top;

        let clickedItem = null;
        for (let i = canvasItems.length - 1; i >= 0; i--) {
            const item = canvasItems[i];
            if (mouseX >= item.x && mouseX <= item.x + item.width &&
                mouseY >= item.y && mouseY <= item.y + item.height) {
                clickedItem = item;
                break;
            }
        }

        setActiveCanvasItem(clickedItem);

        if (clickedItem) {
            isDragging = true;
            offsetX = mouseX - clickedItem.x;
            offsetY = mouseY - clickedItem.y;
        }
    });

    canvas.addEventListener('mousemove', (e) => {
        if (isDragging && activeCanvasItem) {
            const mouseX = e.clientX - canvas.getBoundingClientRect().left;
            const mouseY = e.clientY - canvas.getBoundingClientRect().top;
            activeCanvasItem.x = mouseX - offsetX;
            activeCanvasItem.y = mouseY - offsetY;
            drawCanvas();
        }
    });

    canvas.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    canvas.addEventListener('mouseleave', () => {
        isDragging = false;
    });

    zoomSlider.addEventListener('input', (e) => {
        if (activeCanvasItem) {
            const newScale = parseFloat(e.target.value);
            activeCanvasItem.scale = newScale;
            const oldWidth = activeCanvasItem.width;
            const oldHeight = activeCanvasItem.height;
            activeCanvasItem.width = 100 * newScale;
            activeCanvasItem.height = 100 * newScale;
            activeCanvasItem.x += (oldWidth - activeCanvasItem.width) / 2;
            activeCanvasItem.y += (oldHeight - activeCanvasItem.height) / 2;
            drawCanvas();
        }
    });

    saveButton.addEventListener('click', () => {
        const currentActiveItem = activeCanvasItem; // 現在のアクティブアイテムを保持
        setActiveCanvasItem(null); // 保存時に選択枠を消す
        drawCanvasForSave(); // 枠線なしで再描画

        const link = document.createElement('a');
        link.download = 'free-plan-composition.png'; // ファイル名を変更
        link.href = canvas.toDataURL('image/png');
        link.click();

        // ダウンロード後に元のアクティブアイテムを復元
        if (currentActiveItem) {
            setActiveCanvasItem(currentActiveItem);
        }
        drawCanvas(); // 選択枠を再描画
    });

    function initialize() {
        let imagesLoaded = 0;
        const totalImages = itemData.length;

        if (totalImages === 0) {
            createSelectionUI();
            resizeCanvas();
            return;
        }

        itemData.forEach((item, index) => {
            item.id = `group${item.group}-item${index}`;
            item.image = new Image();
            item.image.src = item.imagePath;
            item.image.onload = () => {
                imagesLoaded++;
                if (imagesLoaded === totalImages) {
                    createSelectionUI();
                    resizeCanvas();
                }
            };
            item.image.onerror = () => {
                console.error(`画像の読み込みに失敗: ${item.imagePath}`);
                imagesLoaded++;
                if (imagesLoaded === totalImages) {
                    createSelectionUI();
                    resizeCanvas();
                }
            };
        });

        window.addEventListener('resize', resizeCanvas);
    }

    initialize();
});
