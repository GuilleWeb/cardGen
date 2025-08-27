$(document).ready(function() {
    
    // ====================================
    // Configuración y Variables Globales
    // ====================================
    const $cardCanvas = $('#card-canvas');
    const $settingsPanel = $('#element-settings');
    let selectedElement = null;
    let isDragging = false; 

    // ====================================
    // Funcionalidades de la Interfaz
    // ====================================
    
    // Manejo de paneles (CORREGIDO con delegación de eventos)
    $('.tabs').on('click', 'li a', function(e) {
        e.preventDefault();
        $('.tabs li').removeClass('is-active');
        $(this).parent().addClass('is-active');
        $('.panel-content').removeClass('is-active');
        const panelId = $(this).data('panel');
        $(`#${panelId}`).addClass('is-active');
    });

    // ====================================
    // Lógica del Lienzo de la Tarjeta
    // ====================================

    // Deseleccionar un elemento al hacer clic fuera
    $cardCanvas.on('click', function(e) {
        if ($(e.target).is('#card-canvas') && !isDragging) {
            deselectElement();
        }
        isDragging = false;
    });

    // Función para deseleccionar cualquier elemento
    function deselectElement() {
        if (selectedElement) {
            selectedElement.removeClass('is-selected').css('z-index', 10);
            selectedElement = null;
            $settingsPanel.html('<p class="has-text-centered">Selecciona un elemento en la tarjeta para editarlo.</p>');
        }
    }

    // Seleccionar y activar arrastre/edición
    function selectElement(element) {
        deselectElement();
        selectedElement = element;
        selectedElement.addClass('is-selected');
        
        const draggie = new Draggabilly(selectedElement[0], {
            containment: '#card-canvas'
        });

        draggie.on('dragStart', function() {
            isDragging = true;
        });

        draggie.on('dragEnd', function() {
            setTimeout(() => { isDragging = false; }, 100);
        });
    }

    // Manejador de clic para agregar fondos desde la galería
    $('#background-gallery').on('click', 'img', function() {
        const imageUrl = $(this).attr('src');
        $cardCanvas.css('background-image', `url(${imageUrl})`);
    });

    // Manejador de clic para agregar texto
    $('#text').on('click', 'button', function() {
        const textType = $(this).data('text-type');
        const defaultText = textType === 'h3' ? 'Título' : 'Texto';
        const newElement = $(`<${textType} class="card-element">${defaultText}</${textType}>`);
        $cardCanvas.append(newElement);
        selectElement(newElement);
        loadSettings(newElement, 'text');
        
        $('.tabs li').removeClass('is-active');
        $(`a[data-panel="settings"]`).parent().addClass('is-active');
        $('.panel-content').removeClass('is-active');
        $('#settings').addClass('is-active');
    });

    // Manejador de clic para agregar iconos (de Font Awesome y locales)
    $('#icon-gallery').on('click', 'img', function() {
        const imageUrl = $(this).attr('src');
        const newElement = $(`<img class="card-element" src="${imageUrl}" style="width: 64px; height: 64px;">`);
        $cardCanvas.append(newElement);
        selectElement(newElement);
        loadSettings(newElement, 'image');
        
        $('.tabs li').removeClass('is-active');
        $(`a[data-panel="settings"]`).parent().addClass('is-active');
        $('.panel-content').removeClass('is-active');
        $('#settings').addClass('is-active');
    });
    
    $('#icon-gallery').on('click', '.icon', function() {
        const iconClass = $(this).find('i').attr('class');
        // Para Font Awesome, envolver en un span para aplicar el tamaño al contenedor
        const newElement = $(`<span class="card-element icon-wrapper"><i class="${iconClass}"></i></span>`);
        $cardCanvas.append(newElement);
        selectElement(newElement);
        loadSettings(newElement, 'icon');
        
        // Cambiar a la pestaña de Ajustes
        $('.tabs li').removeClass('is-active');
        $(`a[data-panel="settings"]`).parent().addClass('is-active');
        $('.panel-content').removeClass('is-active');
        $('#settings').addClass('is-active');
    });

    // ====================================
    // Lógica de Subida de Archivos
    // ====================================
    
    $('#upload-background-file').on('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const newImage = `<img src="${e.target.result}" class="is-clickable">`;
                $('#background-gallery').prepend(newImage);
                $cardCanvas.css('background-image', `url(${e.target.result})`);
            };
            reader.readAsDataURL(file);
        }
    });

    $('#upload-icon-file').on('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const newImage = `<img src="${e.target.result}" class="is-clickable">`;
                $('#icon-gallery').prepend(newImage);
                const newElement = $(`<img class="card-element" src="${e.target.result}" style="width: 64px; height: 64px;">`);
                $cardCanvas.append(newElement);
                selectElement(newElement);
                loadSettings(newElement, 'image');

                $('.tabs li').removeClass('is-active');
                $(`a[data-panel="settings"]`).parent().addClass('is-active');
                $('.panel-content').removeClass('is-active');
                $('#settings').addClass('is-active');
            };
            reader.readAsDataURL(file);
        }
    });

    // ====================================
    // Controles de Edición
    // ====================================

    function loadSettings(element, type) {
        let settingsHtml = '';
        
        settingsHtml += `
            <div class="setting-control">
                <label class="label">Posición</label>
                <div class="buttons is-centered">
                    <button class="button is-small is-info" id="bring-to-front">
                        <span class="icon"><i class="fas fa-arrow-up"></i></span>
                        <span>Al Frente</span>
                    </button>
                    <button class="button is-small is-info" id="send-to-back">
                        <span class="icon"><i class="fas fa-arrow-down"></i></span>
                        <span>Al Fondo</span>
                    </button>
                </div>
            </div>
            <button class="button is-danger is-small is-fullwidth mt-2" id="delete-element">
                <span class="icon"><i class="fas fa-trash-alt"></i></span>
                <span>Eliminar</span>
            </button>
        `;

        // Tamaño y color para todos los elementos
        let sizeValue = 0;
        let sizeMin = 10;
        let sizeMax = 200;
        if (type === 'text' || type === 'icon') {
            sizeValue = parseInt(element.css('font-size'));
        } else if (type === 'image') {
            sizeValue = parseInt(element.width());
            sizeMax = 500;
        }

        const currentColor = element.css('color');

        settingsHtml += `
            <div class="setting-control">
                <label class="label">Tamaño (<span id="size-value">${sizeValue}</span>px)</label>
                <div class="control">
                    <input type="range" class="slider is-fullwidth" min="${sizeMin}" max="${sizeMax}" value="${sizeValue}" data-setting="size">
                </div>
            </div>
        `;
        
        settingsHtml += `
            <div class="setting-control">
                <label class="label">Color</label>
                <div class="control">
                    <input type="color" class="color-picker" value="${rgbToHex(currentColor)}">
                </div>
            </div>
        `;

        if (type === 'text') {
            const isBold = element.css('font-weight') === '700' || element.css('font-weight') === 'bold';
            const isItalic = element.css('font-style') === 'italic';
            const isStrikethrough = element.css('text-decoration-line') === 'line-through';

            const boldClass = isBold ? 'is-info' : 'is-light';
            const italicClass = isItalic ? 'is-info' : 'is-light';
            const strikethroughClass = isStrikethrough ? 'is-info' : 'is-light';

            settingsHtml += `
                <div class="setting-control">
                    <label class="label">Contenido</label>
                    <div class="control">
                        <input type="text" class="input" value="${element.text()}" data-setting="text-content">
                    </div>
                </div>
                <div class="setting-control">
                    <label class="label">Fuente</label>
                    <div class="control">
                        <div class="select is-fullwidth">
                            <select data-setting="font-family">
                                <option value="Roboto">Roboto</option>
                                <option value="Montserrat">Montserrat</option>
                                <option value="Playfair Display">Playfair Display</option>
                                <option value="Lato">Lato</option>
                                <option value="Oswald">Oswald</option>
                                <option value="Merriweather">Merriweather</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="setting-control">
                    <label class="label">Estilos de texto</label>
                    <div class="buttons">
                        <button class="button is-small ${boldClass}" data-style="bold">
                            <span class="icon"><i class="fas fa-bold"></i></span>
                        </button>
                        <button class="button is-small ${italicClass}" data-style="italic">
                            <span class="icon"><i class="fas fa-italic"></i></span>
                        </button>
                        <button class="button is-small ${strikethroughClass}" data-style="strikethrough">
                            <span class="icon"><i class="fas fa-strikethrough"></i></span>
                        </button>
                    </div>
                </div>
            `;
        }

        $settingsPanel.html(settingsHtml);

        // Preseleccionar la fuente actual
        if (type === 'text') {
            const currentFont = element.css('font-family').replace(/['"]+/g, '');
            $settingsPanel.find(`select[data-setting="font-family"] option[value="${currentFont}"]`).prop('selected', true);
        }
        
        $settingsPanel.off('input change', 'input, select, button');
        
        $settingsPanel.on('input change', 'input[type="range"]', function() {
            const size = $(this).val();
            $('#size-value').text(size);
            if (type === 'text' || type === 'icon') {
                selectedElement.css('font-size', `${size}px`);
            } else if (type === 'image') {
                selectedElement.css({ 'width': `${size}px`, 'height': 'auto' });
            }
        });
        
        $settingsPanel.on('input', 'input[type="text"]', function() {
            if ($(this).data('setting') === 'text-content') {
                selectedElement.text($(this).val());
            }
        });

        $settingsPanel.on('change', 'select', function() {
            if ($(this).data('setting') === 'font-family') {
                selectedElement.css('font-family', $(this).val());
            }
        });
        
        $settingsPanel.on('input', '.color-picker', function() {
            selectedElement.css('color', $(this).val());
        });

        $settingsPanel.on('click', '#delete-element', function() {
            selectedElement.remove();
            deselectElement();
        });

        $settingsPanel.on('click', '#bring-to-front', function() {
            const currentZ = parseInt(selectedElement.css('z-index')) || 10;
            selectedElement.css('z-index', currentZ + 1);
        });
        
        $settingsPanel.on('click', '#send-to-back', function() {
            const currentZ = parseInt(selectedElement.css('z-index')) || 10;
            selectedElement.css('z-index', currentZ - 1);
        });

        // Manejador de estilos de texto
        $settingsPanel.on('click', 'button[data-style]', function() {
            const $button = $(this);
            const style = $button.data('style');
            
            if (style === 'bold') {
                const isBold = selectedElement.css('font-weight') === '700' || selectedElement.css('font-weight') === 'bold';
                selectedElement.css('font-weight', isBold ? 'normal' : 'bold');
                $button.toggleClass('is-info is-light', !isBold);
            } else if (style === 'italic') {
                const isItalic = selectedElement.css('font-style') === 'italic';
                selectedElement.css('font-style', isItalic ? 'normal' : 'italic');
                $button.toggleClass('is-info is-light', !isItalic);
            } else if (style === 'strikethrough') {
                const hasStrikethrough = selectedElement.css('text-decoration-line') === 'line-through';
                selectedElement.css('text-decoration-line', hasStrikethrough ? 'none' : 'line-through');
                $button.toggleClass('is-info is-light', !hasStrikethrough);
            }
        });
    }

    // Función auxiliar para convertir RGB a Hex
    function rgbToHex(rgb) {
        if (!rgb || rgb.startsWith('#')) {
            return rgb;
        }
        const a = rgb.split("(")[1].split(")")[0];
        rgb = a.split(",");
        const hex = rgb.map(function(x) {
            x = parseInt(x).toString(16);
            return (x.length === 1) ? "0" + x : x;
        }).join('');
        return '#' + hex;
    }

    // Escuchar clics en el lienzo para seleccionar elementos
    $cardCanvas.on('click', '.card-element', function(e) {
        e.stopPropagation();
        selectElement($(this));
        const elementType = $(this).is('img') ? 'image' : ($(this).is('span.icon') ? 'icon' : 'text');
        loadSettings($(this), elementType);
    });

    // ====================================
    // Generación de Imagen
    // ====================================
    // Generar imagen y descargar
    $('.buttons').on('click', 'button[data-quality]', function() {
        deselectElement();
        
        const quality = parseFloat($(this).data('quality'));
        const scaleFactor = quality;
        
        // Ocultar la cuadrícula de forma segura para la captura
        const $cardGrid = $('#card-grid');
        const gridWasVisible = !$cardGrid.hasClass('is-hidden'); // Verifica si estaba visible
        
        if (gridWasVisible) {
            $cardGrid.addClass('is-hidden'); // Ocultar la cuadrícula antes de la captura
        }

        html2canvas(document.getElementById('card-canvas'), {
            scale: scaleFactor
        }).then(canvas => {
            const imageData = canvas.toDataURL('image/png');
            $('#download-link').attr('href', imageData).attr('download', 'tarjeta.png').removeClass('is-hidden');

            // Volver a mostrar la cuadrícula si estaba visible
            if (gridWasVisible) {
                $cardGrid.removeClass('is-hidden'); // Mostrar la cuadrícula de nuevo
            }
        });
    });


   // Alternar la cuadrícula
    $('#grid-switch').on('change', function() {
        if ($(this).is(':checked')) {
            $('#card-grid').removeClass('is-hidden'); // Mostrar la cuadrícula
        } else {
            $('#card-grid').addClass('is-hidden');    // Ocultar la cuadrícula
        }
    });

});