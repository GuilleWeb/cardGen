<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creador de Tarjetas de Presentación</title>

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Montserrat:wght@400;700&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://unpkg.com/draggabilly@3.0.0/dist/draggabilly.pkgd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>

    <link rel="stylesheet" href="style.css">
    <script src="script.js"></script>
</head>
<body>

    <section class="section">
        <div class="container">
            
            
            <div class="columns is-multiline">
                <div class="column is-one-quarter">
                    <div class="panel is-info">
                        <p class="panel-heading">Herramientas</p>
                        
                        <div class="panel-block p-0">
                            <div class="tabs toggle is-fullwidth">
                                <ul>
                                    <li class="is-active"><a data-panel="backgrounds">Fondos</a></li>
                                    <li><a data-panel="text">Texto</a></li>
                                    <li><a data-panel="icons">Iconos</a></li>
                                    <li><a data-panel="settings">Ajustes</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="box panel-content is-active" id="backgrounds">
                        <h3 class="title is-5">Fondos</h3>
                        <div class="file is-small is-fullwidth mb-4">
                            <label class="file-label">
                                <input class="file-input" type="file" id="upload-background-file" accept="image/*">
                                <span class="file-cta">
                                    <span class="file-icon"><i class="fas fa-upload"></i></span>
                                    <span class="file-label">Subir Fondo</span>
                                </span>
                            </label>
                        </div>
                        <div class="is-flex is-flex-wrap-wrap is-justify-content-center" id="background-gallery">
                            <?php
                            $back_dir = 'files/backs/';
                            if (is_dir($back_dir)) {
                                $files = scandir($back_dir);
                                foreach ($files as $file) {
                                    if ($file != '.' && $file != '..') {
                                        echo '<img src="' . $back_dir . $file . '" class="is-clickable">';
                                    }
                                }
                            }
                            ?>
                        </div>
                    </div>

                    <div class="box panel-content" id="text">
                        <h3 class="title is-5">Agregar Texto</h3>
                        <div class="buttons is-centered">
                            <button class="button is-info is-light" data-text-type="h3">Título</button>
                            <button class="button is-info is-light" data-text-type="p">Párrafo</button>
                        </div>
                    </div>

                    <div class="box panel-content" id="icons">
                        <h3 class="title is-5">Iconos</h3>
                        <div class="file is-small is-fullwidth mb-4">
                            <label class="file-label">
                                <input class="file-input" type="file" id="upload-icon-file" accept="image/*">
                                <span class="file-cta">
                                    <span class="file-icon"><i class="fas fa-upload"></i></span>
                                    <span class="file-label">Subir Icono/Logo</span>
                                </span>
                            </label>
                        </div>
                        <div class="is-flex is-flex-wrap-wrap is-justify-content-center" id="icon-gallery">
                            <?php
                            

                            // Iconos de Font Awesome fijos
                            $fontAwesomeIcons = [
                                'fas fa-user', 'fas fa-envelope', 'fas fa-phone', 'fas fa-map-marker-alt',
                                'fas fa-globe', 'fab fa-linkedin', 'fab fa-instagram', 'fab fa-twitter',
                                'fas fa-briefcase', 'fas fa-laptop-code', 'fas fa-credit-card'
                            ];
                            foreach ($fontAwesomeIcons as $iconClass) {
                                echo '<span class="icon is-clickable"><i class="' . $iconClass . '"></i></span>';
                            }
                            ?>
                        </div>
                    </div>
                    
                    <div class="box panel-content" id="settings">
                        <h3 class="title is-5">Ajustes</h3>
                        <div id="element-settings">
                            <p class="has-text-centered">Selecciona un elemento en la tarjeta para editarlo.</p>
                            </div>
                    </div>
                    
                    <div class="box mt-4">
                        <h3 class="title is-5">Generar Imagen</h3>
                        <div class="buttons is-centered">
                            <button id="generate-low" class="button is-small is-dark is-outlined" data-quality="0.5">Baja</button>
                            <button id="generate-standard" class="button is-small is-dark" data-quality="1.0">Estándar</button>
                            <button id="generate-high" class="button is-small is-dark is-outlined" data-quality="2.0">HD</button>
                        </div>
                        <a id="download-link" class="button is-success is-fullwidth mt-3 is-hidden">
                            <span class="icon"><i class="fas fa-download"></i></span>
                            <span>Descargar Tarjeta</span>
                        </a>
                    </div>
                </div>

                <div class="column is-three-quarters">
                	<h1 class="title has-text-centered">Crea tu Tarjeta de Presentación</h1>
            		<p class="subtitle has-text-centered">Diseña, personaliza y descarga tu tarjeta profesional en minutos.</p>
                    <div class="box card-canvas-wrapper">
					        <input id="grid-switch" type="checkbox" name="grid-switch" class="switch is-rounded is-info">
					        <label for="grid-switch">Mostrar cuadrícula</label>
                        <div id="card-canvas"><div id="card-grid" class="is-hidden"></div>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

</body>
</html>