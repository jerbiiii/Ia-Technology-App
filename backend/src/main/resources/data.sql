-- ============================================================
-- SCRIPT SQL DE DONNÉES - IA Technology App
-- Compatible MySQL / MariaDB
-- Mots de passe encodés BCrypt (plaintext: "Password123!")
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- NETTOYAGE DES TABLES (ordre inverse des dépendances)
-- ============================================================
DELETE FROM audit_logs;
DELETE FROM publication_domain;
DELETE FROM publication_researcher;
DELETE FROM researcher_domain;
DELETE FROM home_content;
DELETE FROM highlights;
DELETE FROM actualites;
DELETE FROM publications;
DELETE FROM researchers;
DELETE FROM domains WHERE parent_id IS NOT NULL;
DELETE FROM domains;
DELETE FROM users;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 1. UTILISATEURS (users)
-- Password BCrypt de "Password123!" pour tous les users
-- ============================================================
INSERT INTO users (id, email, password, nom, prenom, role, date_inscription) VALUES
(1,  'admin@iatechnology.tn',       '$2a$12$/KwjomHA.mY4Zobk3AOjuu6kKRLeRi/Bqm0CF19CC7G5lW/BkuHfK', 'Adminsson',    'Admin',    'ADMIN',        '2023-01-10 08:00:00'),
(2,  'mod1@iatechnology.tn',        '$2a$12$/KwjomHA.mY4Zobk3AOjuu6kKRLeRi/Bqm0CF19CC7G5lW/BkuHfK', 'Moderateur',   'Jean',     'MODERATEUR',   '2023-01-15 09:00:00'),
(3,  'mod2@iatechnology.tn',        '$2a$12$/KwjomHA.mY4Zobk3AOjuu6kKRLeRi/Bqm0CF19CC7G5lW/BkuHfK', 'Benali',       'Nadia',    'MODERATEUR',   '2023-02-01 10:00:00'),
(4,  'ali.ben.salah@gmail.com',     '$2a$12$/KwjomHA.mY4Zobk3AOjuu6kKRLeRi/Bqm0CF19CC7G5lW/BkuHfK', 'Ben Salah',    'Ali',      'UTILISATEUR',  '2023-02-10 11:00:00'),
(5,  'sonia.maaloul@gmail.com',     '$2a$12$/KwjomHA.mY4Zobk3AOjuu6kKRLeRi/Bqm0CF19CC7G5lW/BkuHfK', 'Maaloul',      'Sonia',    'UTILISATEUR',  '2023-03-05 12:00:00'),
(6,  'karim.ferchichi@enit.tn',     '$2a$12$/KwjomHA.mY4Zobk3AOjuu6kKRLeRi/Bqm0CF19CC7G5lW/BkuHfK', 'Ferchichi',    'Karim',    'UTILISATEUR',  '2023-03-12 09:30:00'),
(7,  'fatma.trabelsi@usf.tn',       '$2a$12$/KwjomHA.mY4Zobk3AOjuu6kKRLeRi/Bqm0CF19CC7G5lW/BkuHfK', 'Trabelsi',     'Fatma',    'UTILISATEUR',  '2023-04-01 14:00:00'),
(8,  'med.gharbi@insat.tn',         '$2a$12$/KwjomHA.mY4Zobk3AOjuu6kKRLeRi/Bqm0CF19CC7G5lW/BkuHfK', 'Gharbi',       'Mohamed',  'UTILISATEUR',  '2023-04-20 08:45:00'),
(9,  'ines.chahed@gmail.com',       '$2a$12$/KwjomHA.mY4Zobk3AOjuu6kKRLeRi/Bqm0CF19CC7G5lW/BkuHfK', 'Chahed',       'Ines',     'UTILISATEUR',  '2023-05-03 16:00:00'),
(10, 'slim.bouaziz@ept.tn',         '$2a$12$/KwjomHA.mY4Zobk3AOjuu6kKRLeRi/Bqm0CF19CC7G5lW/BkuHfK', 'Bouaziz',      'Slim',     'UTILISATEUR',  '2023-05-18 11:20:00'),
(11, 'rania.souissi@gmail.com',     '$2a$12$/KwjomHA.mY4Zobk3AOjuu6kKRLeRi/Bqm0CF19CC7G5lW/BkuHfK', 'Souissi',      'Rania',    'UTILISATEUR',  '2023-06-01 09:00:00'),
(12, 'anis.saad@insat.tn',          '$2a$12$/KwjomHA.mY4Zobk3AOjuu6kKRLeRi/Bqm0CF19CC7G5lW/BkuHfK', 'Saad',         'Anis',     'UTILISATEUR',  '2023-06-15 13:30:00'),
(13, 'leila.jomni@enit.tn',         '$2a$12$/KwjomHA.mY4Zobk3AOjuu6kKRLeRi/Bqm0CF19CC7G5lW/BkuHfK', 'Jomni',        'Leila',    'UTILISATEUR',  '2023-07-10 10:00:00'),
(14, 'hedi.mansour@gmail.com',      '$2a$12$/KwjomHA.mY4Zobk3AOjuu6kKRLeRi/Bqm0CF19CC7G5lW/BkuHfK', 'Mansour',      'Hedi',     'UTILISATEUR',  '2023-07-22 15:00:00'),
(15, 'amira.karray@usf.tn',         '$2a$12$/KwjomHA.mY4Zobk3AOjuu6kKRLeRi/Bqm0CF19CC7G5lW/BkuHfK', 'Karray',       'Amira',    'UTILISATEUR',  '2023-08-05 08:00:00');

-- ============================================================
-- 2. DOMAINES DE RECHERCHE (domains)
-- Hiérarchie : parent_id NULL = domaine racine
-- ============================================================
INSERT INTO domains (id, nom, description, parent_id) VALUES
-- Domaines parents
(1,  'Intelligence Artificielle',            'Domaine regroupant toutes les disciplines liées à l''IA',                         NULL),
(2,  'Réseaux et Télécommunications',        'Systèmes de communication, protocoles réseau et infrastructures',                  NULL),
(3,  'Sécurité Informatique',                'Cybersécurité, cryptographie et protection des systèmes',                         NULL),
(4,  'Génie Logiciel',                       'Développement logiciel, architecture et ingénierie des systèmes',                  NULL),
(5,  'Sciences des Données',                 'Analyse et traitement massif des données',                                        NULL),
(6,  'Systèmes Embarqués et IoT',            'Microcontrôleurs, systèmes temps réel et Internet des Objets',                    NULL),
(7,  'Vision par Ordinateur',                'Traitement d''image, reconnaissance visuelle et réalité augmentée',               NULL),
(8,  'Robotique',                            'Conception, contrôle et interaction des robots avec l''environnement',             NULL),

-- Sous-domaines de l'IA (parent 1)
(9,  'Apprentissage Automatique',            'Machine Learning : algorithmes supervisés et non supervisés',                     1),
(10, 'Apprentissage Profond',                'Deep Learning : réseaux de neurones profonds',                                   1),
(11, 'Traitement du Langage Naturel',        'NLP : compréhension et génération de texte en langage humain',                   1),
(12, 'Systèmes Multi-Agents',                'Coordination et comportement de multiples agents intelligents',                   1),
(13, 'Raisonnement et Représentation',       'Logiques formelles, ontologies et bases de connaissances',                       1),

-- Sous-domaines des données (parent 5)
(14, 'Big Data',                             'Traitement des très grands volumes de données (Hadoop, Spark)',                   5),
(15, 'Fouille de Données',                   'Extraction de connaissances à partir de bases de données',                       5),
(16, 'Visualisation des Données',            'Représentation graphique et tableaux de bord interactifs',                       5),

-- Sous-domaines de la sécurité (parent 3)
(17, 'Cryptographie',                        'Chiffrement, signature numérique et protocoles cryptographiques',                  3),
(18, 'Sécurité des Réseaux',                 'Pare-feu, VPN, détection d''intrusions et sécurité Wi-Fi',                       3),
(19, 'Sécurité des Applications Web',        'OWASP, injection SQL, XSS, protection des API REST',                             3);

-- ============================================================
-- 3. CHERCHEURS (researchers)
-- Liés à des utilisateurs pour certains (user_id)
-- ============================================================
INSERT INTO researchers (id, nom, prenom, email, affiliation, domaine_principal_id, user_id) VALUES
(1,  'Ben Salah',   'Ali',       'ali.ben.salah@gmail.com',      'ENIT - École Nationale d''Ingénieurs de Tunis',                1,  4),
(2,  'Maaloul',     'Sonia',     'sonia.maaloul@gmail.com',      'INSAT - Institut National des Sciences Appliquées',            9,  5),
(3,  'Ferchichi',   'Karim',     'karim.ferchichi@enit.tn',      'ENIT - Département Informatique',                              10, 6),
(4,  'Trabelsi',    'Fatma',     'fatma.trabelsi@usf.tn',        'Université de Sfax - Faculté des Sciences',                   11, 7),
(5,  'Gharbi',      'Mohamed',   'med.gharbi@insat.tn',          'INSAT - Laboratoire NOCCS',                                   3,  8),
(6,  'Chahed',      'Ines',      'ines.chahed@gmail.com',        'Université de Carthage - ENSI',                               5,  9),
(7,  'Bouaziz',     'Slim',      'slim.bouaziz@ept.tn',          'École Polytechnique de Tunisie',                               7,  10),
(8,  'Souissi',     'Rania',     'rania.souissi@gmail.com',      'Université Virtuelle de Tunis (UVT)',                         4,  11),
(9,  'Saad',        'Anis',      'anis.saad@insat.tn',           'INSAT - Laboratoire SERCOM',                                  2,  12),
(10, 'Jomni',       'Leila',     'leila.jomni@enit.tn',          'ENIT - Laboratoire d''Automatique',                           8,  13),
(11, 'Mansour',     'Hedi',      'hedi.mansour@gmail.com',       'Université de Monastir - Faculté des Sciences',               15, 14),
(12, 'Karray',      'Amira',     'amira.karray@usf.tn',          'Université de Sfax - MIRACL Laboratory',                      4,  15),
(13, 'Dridi',       'Othman',    'othman.dridi@ept.tn',          'École Polytechnique de Tunisie - TIC',                        17, NULL),
(14, 'Abidi',       'Nour',      'nour.abidi@univ-tunis.tn',     'Université de Tunis El Manar - FST',                          9,  NULL),
(15, 'Jemai',       'Adel',      'adel.jemai@esstt.rnu.tn',      'ESSTT - Unité de Recherche CRNS',                             6,  NULL),
(16, 'Khemiri',     'Sara',      'sara.khemiri@ihec.rnu.tn',     'IHEC Carthage - Intelligence Décisionnelle',                  16, NULL),
(17, 'Zouari',      'Bassem',    'bassem.zouari@enet.tn',        'École Nationale d''Electronique et Télécommunications',       2,  NULL),
(18, 'Baccouche',   'Houda',     'houda.baccouche@gmail.com',    'Université de la Manouba - ISIA',                             11, NULL),
(19, 'Hammami',     'Omar',      'omar.hammami@supcom.tn',       'SUP''COM - Laboratoire Télécommunications',                   12, NULL),
(20, 'Rekik',       'Samia',     'samia.rekik@isamm.tn',         'ISAMM - Multimédia et IA',                                   10, NULL);

-- ============================================================
-- 4. PUBLICATIONS
-- ============================================================
INSERT INTO publications (id, titre, resume, date_publication, doi, chemin_fichier) VALUES
(1,  'Détection d''anomalies dans les réseaux IoT par apprentissage profond',
     'Cette étude propose une architecture de réseau de neurones convolutifs (CNN) combinée à un auto-encodeur LSTM pour détecter en temps réel les anomalies dans les flux de trafic des réseaux IoT. Les expériences menées sur le dataset NSL-KDD montrent un taux de détection de 98,7% avec un taux de faux positifs inférieur à 0,5%.',
     '2024-03-15', '10.1016/j.future.2024.001', 'uploads/pub_001.pdf'),

(2,  'Optimisation des hyperparamètres des réseaux de neurones par algorithmes génétiques',
     'Nous présentons une méthode hybride combinant les algorithmes génétiques et la recherche bayésienne pour optimiser automatiquement l''architecture et les hyperparamètres des réseaux de neurones profonds. La méthode réduit le temps de recherche de 70% comparé à la recherche en grille traditionnelle.',
     '2024-01-20', '10.1109/TNNLS.2024.001', 'uploads/pub_002.pdf'),

(3,  'Traitement multi-langue du texte arabe-français en milieu médical',
     'Cet article explore les défis de la reconnaissance d''entités nommées (NER) dans des textes bilingues arabe-français issus de dossiers médicaux tunisiens. Nous proposons un modèle BERT fine-tuné sur un corpus annoté de 45 000 phrases médicales.',
     '2023-11-10', '10.18653/v1/2023.emnlp.001', 'uploads/pub_003.pdf'),

(4,  'Segmentation sémantique des images satellitaires par réseau encoder-decoder',
     'Ce travail présente un réseau encoder-decoder basé sur l''architecture U-Net améliorée pour la segmentation automatique des zones urbaines et agricoles dans les images de télédétection à haute résolution. Validé sur des images Sentinel-2 de la Tunisie.',
     '2023-09-05', '10.1016/j.rse.2023.113456', 'uploads/pub_004.pdf'),

(5,  'Protocole sécurisé d''échange de clés pour les communications véhiculaires (V2X)',
     'Nous proposons un nouveau protocole cryptographique basé sur les courbes elliptiques pour sécuriser les communications entre véhicules connectés. Le protocole garantit l''authentification mutuelle, la confidentialité prospective et la résistance aux attaques par rejeu avec un overhead de 12ms.',
     '2024-04-02', '10.1109/TVT.2024.001', 'uploads/pub_005.pdf'),

(6,  'Détection de fake news en langue arabe par modèle transformeur',
     'Cet article présente AraBERT-Fake, un modèle de détection des fausses informations en arabe dialectal tunisien et standard, entraîné sur un dataset de 120 000 articles. Le modèle atteint une précision de 94,2% sur le jeu de test.',
     '2024-02-28', '10.18653/v1/2024.acl.001', 'uploads/pub_006.pdf'),

(7,  'Architecture microservices pour les plateformes d''e-learning adaptatif',
     'Nous décrivons l''architecture d''une plateforme d''apprentissage en ligne basée sur des microservices communiquant via Apache Kafka, intégrant un moteur de recommandation par filtrage collaboratif pour personnaliser le parcours pédagogique de chaque apprenant.',
     '2023-07-14', '10.1145/3543507.2023.001', 'uploads/pub_007.pdf'),

(8,  'Analyse Big Data des comportements de mobilité post-COVID en Tunisie',
     'À partir de 2,4 milliards d''enregistrements de données de téléphonie mobile, cette étude analyse l''évolution des patterns de mobilité urbaine en Tunisie avant, pendant et après la pandémie de COVID-19, en utilisant Apache Spark et des algorithmes de clustering spatio-temporel.',
     '2023-06-01', '10.1016/j.cities.2023.103789', 'uploads/pub_008.pdf'),

(9,  'Système multi-agents pour la gestion intelligente de l''énergie dans les smart grids',
     'Nous proposons un système multi-agents basé sur le protocole FIPA-ACL pour optimiser la distribution d''énergie dans les réseaux électriques intelligents, intégrant des sources d''énergie renouvelables intermittentes. Les simulations montrent une réduction de 23% de la consommation en heures de pointe.',
     '2024-05-20', '10.1016/j.apenergy.2024.001', 'uploads/pub_009.pdf'),

(10, 'Reconnaissance de gestes pour le contrôle de bras robotisé par vision',
     'Cette recherche développe un système de reconnaissance de gestes de la main basé sur MediaPipe et un classifieur Random Forest pour contrôler un bras robotisé industriel. Le système atteint un taux de reconnaissance de 96,4% en conditions d''éclairage variable.',
     '2023-08-30', '10.1109/TRO.2023.001', 'uploads/pub_010.pdf'),

(11, 'Détection précoce du cancer du sein par réseau neuronal convolutif sur mammographies',
     'Nous présentons BreastNet-TN, un réseau CNN entraîné sur 18 000 mammographies annotées par des radiologues tunisiens pour la détection et classification des lésions mammaires. AUC = 0,97, sensibilité = 95,1%, spécificité = 93,8%.',
     '2024-06-10', '10.1016/j.media.2024.001', 'uploads/pub_011.pdf'),

(12, 'Apprentissage fédéré pour la prédiction de pannes industrielles sans partage de données',
     'Cet article propose un framework d''apprentissage fédéré (Federated Learning) pour la maintenance prédictive dans l''industrie 4.0, permettant à plusieurs usines de collaborer à l''entraînement d''un modèle commun sans exposer leurs données propriétaires.',
     '2024-03-01', '10.1016/j.jmsy.2024.001', 'uploads/pub_012.pdf'),

(13, 'Réseau de neurones graphiques pour l''analyse de dépendances syntaxiques en arabe',
     'Nous appliquons les Graph Neural Networks (GNN) à l''analyse syntaxique de l''arabe classique et dialectal, en modélisant les relations de dépendance comme un graphe. Notre modèle (AraGNN) surpasse les SOTA précédents de 2,3 points de UAS sur l''Arabic UD Treebank.',
     '2023-10-15', '10.18653/v1/2023.emnlp.002', 'uploads/pub_013.pdf'),

(14, 'Optimisation de la consommation énergétique des protocoles MAC dans les réseaux de capteurs sans fil',
     'Nous proposons un protocole MAC adaptatif basé sur une heuristique d''essaim de particules (PSO) pour les réseaux de capteurs sans fil (WSN) en environnements industriels. L''approche prolonge la durée de vie du réseau de 40% comparé à l''algorithme LEACH.',
     '2023-05-25', '10.1109/TCOMM.2023.001', 'uploads/pub_014.pdf'),

(15, 'Analyse de sentiment multi-aspect sur les avis de consommateurs tunisiens',
     'Nous créons TunSA, le premier dataset public d''analyse de sentiment multi-aspect pour l''arabe dialectal tunisien (28 000 avis annotés) et proposons un modèle d''attention hiérarchique atteignant un F1-score de 82,5%.',
     '2024-01-05', '10.1145/3580305.2024.001', 'uploads/pub_015.pdf'),

(16, 'Sécurité des protocoles MQTT dans les déploiements IoT industriels',
     'Cette étude analyse les vulnérabilités du protocole MQTT en environnement IIoT et propose un système de détection d''intrusions basé sur un auto-encodeur variationnel (VAE) atteignant un F1-score de 99,1% sur le dataset MQTTset.',
     '2023-12-20', '10.1016/j.cose.2023.001', 'uploads/pub_016.pdf'),

(17, 'Fouille de règles d''association dans les dossiers médicaux électroniques',
     'Nous appliquons l''algorithme FP-Growth étendu à l''extraction de règles d''association médicales à partir de 320 000 dossiers patients de trois hôpitaux tunisiens, identifiant 847 règles cliniquement significatives pour la prise en charge du diabète de type 2.',
     '2023-04-18', '10.1016/j.artmed.2023.001', 'uploads/pub_017.pdf'),

(18, 'Planification de trajectoire d''un robot mobile autonome en environnement dynamique',
     'Cet article présente un algorithme de planification de trajectoire hybride combinant A* modifié et apprentissage par renforcement (DQN) pour la navigation de robots mobiles en environnements dynamiques. Validé dans un entrepôt simulé avec 50 obstacles mobiles.',
     '2024-02-14', '10.1016/j.robot.2024.001', 'uploads/pub_018.pdf'),

(19, 'Dashboard interactif pour la visualisation de données agricoles en temps réel',
     'Nous présentons AgroViz-TN, une plateforme de visualisation de données agricoles intégrant des flux temps réel de capteurs IoT déployés dans des exploitations céréalières tunisiennes, avec des tableaux de bord D3.js et des alertes prédictivement basées sur des modèles ARIMA.',
     '2023-11-30', '10.1016/j.compag.2023.001', 'uploads/pub_019.pdf'),

(20, 'Transfert de style artistique par réseau génératif adversarial (CycleGAN)',
     'Ce travail explore l''application des CycleGAN pour le transfert de style artistique entre peintures de la région du Maghreb et photos contemporaines, créant un dataset PatrimoineAI de 12 000 images annotées.',
     '2024-04-25', '10.1145/3641519.2024.001', 'uploads/pub_020.pdf'),

(21, 'Modèle prédictif de la qualité de l''air urbain par apprentissage automatique',
     'Nous combinons des données de 45 stations météorologiques et de trafic routier avec des algorithmes XGBoost et Random Forest pour prédire la concentration en PM2.5 et PM10 dans les grandes villes tunisiennes avec un MAPE inférieur à 5,2%.',
     '2023-09-12', '10.1016/j.envsoft.2023.001', 'uploads/pub_021.pdf'),

(22, 'Détection de malwares par analyse comportementale et apprentissage automatique',
     'Notre système MalDetect analyse les System Calls et API Calls des processus pour détecter les malwares avec un taux de détection de 99,3%, y compris les variants zero-day, grâce à un ensemble stacking combinant SVM, XGBoost et LSTM.',
     '2024-05-05', '10.1016/j.cose.2024.001', 'uploads/pub_022.pdf'),

(23, 'Compression neuronale d''images médicales par variational autoencoder',
     'Nous proposons un VAE spécialisé pour la compression d''images médicales (IRM, scanner) avec reconstruction fidèle aux détails cliniques, atteignant un ratio de compression de 1:40 avec un SSIM > 0,95, surpassant JPEG2000 de 8 points de PSNR.',
     '2023-08-01', '10.1016/j.media.2023.001', 'uploads/pub_023.pdf'),

(24, 'Système de questions-réponses sur des documents juridiques arabes par RAG',
     'Nous développons LexAra-QA, un système de questions-réponses (QA) sur la législation tunisienne utilisant Retrieval-Augmented Generation (RAG) combinant un index sémantique dense et un modèle de génération AraBERT fine-tuné.',
     '2024-06-01', '10.18653/v1/2024.acl.002', 'uploads/pub_024.pdf'),

(25, 'Optimisation combinatoire par algorithme de colonies de fourmis pour le routage VLSI',
     'Nous appliquons un algorithme ACO (Ant Colony Optimization) amélioré par une heuristique locale pour résoudre le problème d''optimisation du routage multicouche dans les circuits VLSI, réduisant la longueur totale des connexions de 15,7% par rapport aux méthodes classiques.',
     '2023-03-22', '10.1109/TCAD.2023.001', 'uploads/pub_025.pdf');

-- ============================================================
-- 5. RELATIONS : chercheurs ↔ publications (publication_researcher)
-- ============================================================
INSERT INTO publication_researcher (publication_id, researcher_id) VALUES
(1,  5), (1,  9), (1,  15),
(2,  2), (2,  3), (2,  14),
(3,  4), (3,  18),
(4,  7), (4,  20),
(5,  5), (5,  13),
(6,  4), (6,  18), (6,  19),
(7,  8), (7,  12),
(8,  6), (8,  11), (8,  16),
(9,  10), (9, 19),
(10, 7),  (10, 10),
(11, 2),  (11, 14),
(12, 2),  (12, 3),  (12, 15),
(13, 4),  (13, 18),
(14, 9),  (14, 17),
(15, 4),  (15, 18),
(16, 5),  (16, 9),
(17, 6),  (17, 11),
(18, 10), (18, 7),
(19, 6),  (19, 16),
(20, 7),  (20, 20),
(21, 6),  (21, 11),
(22, 5),  (22, 13),
(23, 3),  (23, 7),
(24, 4),  (24, 18), (24, 19),
(25, 9),  (25, 17);

-- ============================================================
-- 6. RELATIONS : domaines ↔ publications (publication_domain)
-- ============================================================
INSERT INTO publication_domain (publication_id, domain_id) VALUES
(1,  10), (1,  2),  (1,  6),
(2,  9),  (2,  10),
(3,  11), (3,  1),
(4,  7),  (4,  5),
(5,  17), (5,  2),
(6,  11), (6,  9),
(7,  4),  (7,  5),
(8,  14), (8,  5),
(9,  12), (9,  1),
(10, 7),  (10, 8),
(11, 10), (11, 9),
(12, 9),  (12, 10), (12, 4),
(13, 11), (13, 10),
(14, 2),  (14, 6),
(15, 11), (15, 5),
(16, 3),  (16, 6),  (16, 18),
(17, 15), (17, 5),
(18, 8),  (18, 9),
(19, 16), (19, 5),  (19, 6),
(20, 7),  (20, 10),
(21, 9),  (21, 5),
(22, 3),  (22, 9),  (22, 18),
(23, 10), (23, 9),
(24, 11), (24, 13),
(25, 1),  (25, 4);

-- ============================================================
-- 7. RELATIONS : chercheurs ↔ domaines secondaires (researcher_domain)
-- ============================================================
INSERT INTO researcher_domain (researcher_id, domain_id) VALUES
(1,  9),  (1,  10), (1,  12),
(2,  10), (2,  7),
(3,  10), (3,  7),  (3,  9),
(4,  11), (4,  13),
(5,  17), (5,  18), (5,  19),
(6,  14), (6,  15),
(7,  10), (7,  9),
(8,  4),  (8,  14),
(9,  18), (9,  6),
(10, 9),  (10, 12),
(11, 14), (11, 16),
(12, 9),  (12, 11),
(13, 19), (13, 17),
(14, 10), (14, 7),
(15, 2),  (15, 9),
(16, 14), (16, 5),
(17, 19), (17, 18),
(18, 13), (18, 11),
(19, 12), (19, 1),
(20, 7),  (20, 10);

-- ============================================================
-- 8. ACTUALITES
-- ============================================================
INSERT INTO actualites (id, titre, contenu, date_publication, auteur_id, actif) VALUES
(1,
 'Lancement officiel de la plateforme IA Technology',
 'La plateforme IA Technology est désormais en ligne ! Ce portail centralise les travaux de recherche en intelligence artificielle des chercheurs tunisiens. Il permet de consulter les publications scientifiques, de découvrir les chercheurs actifs et de suivre l''actualité du domaine. Créez votre compte pour accéder à toutes les fonctionnalités.',
 '2024-01-15 10:00:00', 1, true),

(2,
 'Conférence internationale IA & Innovation - Tunis 2024',
 'L''Université de Tunis El Manar accueillera la 5ème édition de la conférence internationale "AI & Innovation" du 20 au 22 mars 2024. Plus de 300 chercheurs de 25 pays sont attendus. Les soumissions d''articles sont ouvertes jusqu''au 15 janvier 2024. Thèmes principaux : apprentissage profond, NLP, robotique et sécurité IA. Informations et inscription sur le site officiel.',
 '2024-01-05 09:30:00', 2, true),

(3,
 'Appel à projets : Programme National de Recherche en IA 2024',
 'Le Ministère de l''Enseignement Supérieur et de la Recherche Scientifique lance un appel à projets pour le Programme National de Recherche en Intelligence Artificielle (PNRIA 2024). Budget total : 5 millions de dinars. Axes prioritaires : santé intelligente, agritech, villes intelligentes et cybersécurité. Date limite de soumission : 30 avril 2024.',
 '2024-02-01 08:00:00', 1, true),

(4,
 'Workshop : Apprentissage Fédéré et Confidentialité des Données',
 'Le Laboratoire NOCCS de l''INSAT organise un workshop d''une journée sur les techniques d''apprentissage fédéré et leur rôle dans la protection des données personnelles en conformité avec le RGPD. Intervenants : chercheurs de l''INRIA France et de l''INSAT Tunisie. Inscription gratuite, places limitées à 80 participants.',
 '2024-02-20 11:00:00', 3, true),

(5,
 'Publication du rapport annuel sur l''état de l''IA en Tunisie',
 'L''Académie Tunisienne des Sciences, des Lettres et des Arts publie son rapport annuel 2023 sur l''état de l''intelligence artificielle en Tunisie. Ce rapport dresse un panorama complet : 284 publications scientifiques, 47 thèses de doctorat, 23 startups IA et 12 laboratoires de recherche actifs. Téléchargement gratuit sur le portail.',
 '2024-03-10 14:00:00', 2, true),

(6,
 'Partenariat IA Technology - Université Paris-Saclay',
 'La plateforme IA Technology et l''Université Paris-Saclay ont signé un accord de coopération scientifique portant sur l''échange de chercheurs, la co-publication d''articles et l''organisation de formations doctorales communes dans les domaines de l''IA et de la science des données. Ce partenariat ouvre également des opportunités de stages pour les étudiants de Master.',
 '2024-03-25 16:00:00', 1, true),

(7,
 'Résultats du Hackathon National IA 2024',
 'Le Hackathon National IA 2024, organisé par l''ENIT en partenariat avec des entreprises technologiques, a réuni 120 équipes soit 480 participants. L''équipe gagnante, composée d''étudiants de l''INSAT, a développé un système de détection précoce des maladies des oliviers par vision par ordinateur. Des prix d''une valeur totale de 30 000 DT ont été remis.',
 '2024-04-08 10:30:00', 3, true),

(8,
 'Nouvelles fonctionnalités : Assistant IA intégré à la plateforme',
 'La plateforme IA Technology intègre désormais un assistant intelligent capable de répondre à vos questions sur les publications, les chercheurs et les domaines de recherche. Cet assistant propulsé par un grand modèle de langage analyse la base de connaissances de la plateforme pour vous fournir des réponses précises et contextualisées. Essayez-le dès maintenant !',
 '2024-04-15 12:00:00', 1, true),

(9,
 'Formation certifiante : Deep Learning avec PyTorch',
 'Le Centre de Formation Continue de l''ENIT propose une formation certifiante de 40 heures en Deep Learning avec PyTorch, destinée aux ingénieurs et chercheurs souhaitant approfondir leurs compétences. Modules : réseaux convolutifs, RNN/LSTM, Transformers et apprentissage par renforcement. Prochaine session : 10 juin 2024.',
 '2024-05-01 09:00:00', 2, true),

(10,
 'Distinction : Chercheur tunisien primé à NeurIPS 2023',
 'Karim Ferchichi, chercheur au Département Informatique de l''ENIT, a reçu le prix "Best Paper Award" lors de la conférence NeurIPS 2023 (Advances in Neural Information Processing Systems) à La Nouvelle-Orléans pour ses travaux sur l''optimisation des hyperparamètres par algorithmes génétiques. Une fierté pour la recherche tunisienne !',
 '2024-05-20 11:00:00', 3, true),

(11,
 'Séminaire : Applications de l''IA dans la santé numérique',
 'La Faculté de Médecine de Tunis et l''ENIT co-organisent un séminaire interdisciplinaire sur les applications de l''intelligence artificielle dans la santé numérique : diagnostic assisté, analyse d''images médicales, médecine personnalisée et modélisation épidémiologique. Ouvert à tous les professionnels de santé et chercheurs.',
 '2024-06-03 14:00:00', 1, true),

(12,
 'Mise à jour de la base de données : 25 nouvelles publications indexées',
 'La base de données de la plateforme IA Technology vient d''être enrichie de 25 nouvelles publications couvrant des domaines variés : vision par ordinateur, sécurité IoT, NLP bilingue arabe-français et systèmes multi-agents. Utilisez les filtres de recherche avancée pour explorer les nouveaux travaux.',
 '2024-06-15 10:00:00', 2, true);

-- ============================================================
-- 9. HIGHLIGHTS (projets ou travaux mis en avant)
-- ============================================================
INSERT INTO highlights (id, titre, description, image_url, date_creation, actif) VALUES
(1,
 'BreastNet-TN : IA pour la détection du cancer du sein',
 'Réseau neuronal convolutif tunisien atteignant 97% d''AUC pour la détection précoce du cancer du sein sur mammographies numériques. Collaboration INSAT–Hôpital Charles Nicolle.',
 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800',
 '2024-06-10 10:00:00', true),

(2,  'AraBERT-Fake : Détection de fake news en arabe dialectal',
 'Modèle transformeur spécialisé pour identifier les fausses informations en arabe tunisien. Dataset de 120 000 articles annotés, précision de 94,2%.',
 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=800',
 '2024-02-28 09:00:00', true),

(3,  'Smart Grid Multi-Agents : Énergie intelligente par IA',
 'Système multi-agents optimisant la distribution d''énergie dans les réseaux électriques tunisiens intégrant solaire et éolien. Réduction de 23% de la consommation en heures de pointe.',
 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800',
 '2024-05-20 11:00:00', true),

(4,  'LexAra-QA : Assistant juridique pour la législation tunisienne',
 'Système de questions-réponses basé sur RAG permettant aux citoyens de consulter la législation tunisienne en langue arabe naturelle. Interface intuitive et mises à jour en temps réel.',
 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800',
 '2024-06-01 12:00:00', true),

(5,  'Hackathon IA 2024 : Innovation et compétition estudiantine',
 '480 participants, 120 équipes, 30 000 DT de prix. Le Hackathon National IA 2024 a révélé des talents exceptionnels dans la détection de maladies agricoles et la robotique autonome.',
 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800',
 '2024-04-08 10:00:00', true),

(6,  'Fédérated Learning IIoT : Maintenance prédictive sans partage de données',
 'Framework révolutionnaire permettant à des usines concurrentes de collaborer à l''entraînement d''IA pour la maintenance prédictive sans divulguer leurs données de production.',
 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
 '2024-03-01 09:00:00', true);

-- ============================================================
-- 10. HOME CONTENT (contenu configurable de la page d'accueil)
-- ============================================================
INSERT INTO home_content (id, cle, libelle, valeur, type, section, actif, date_modification) VALUES
(1,  'hero_title',           'Titre principal',             'Intelligence Artificielle au Service de la Recherche Tunisienne',                    'TEXT', 'HERO',   true, '2024-01-15 10:00:00'),
(2,  'hero_subtitle',        'Sous-titre',                  'Découvrez les publications, les chercheurs et les innovations IA de Tunisie',         'TEXT', 'HERO',   true, '2024-01-15 10:00:00'),
(3,  'hero_button_label',    'Texte du bouton principal',   'Explorer les publications',                                                           'TEXT', 'HERO',   true, '2024-01-15 10:00:00'),
(4,  'hero_button_url',      'Lien du bouton principal',    '/publications',                                                                       'URL',  'HERO',   true, '2024-01-15 10:00:00'),
(5,  'hero_image_url',       'Image de fond hero',          'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',                                         'URL',  'HERO',   true, '2024-01-15 10:00:00'),
(6,  'stats_publications',   'Nombre de publications',      '25',                                                                                  'TEXT', 'HERO',   true, '2024-06-15 10:00:00'),
(7,  'stats_researchers',    'Nombre de chercheurs',        '20',                                                                                  'TEXT', 'HERO',   true, '2024-06-15 10:00:00'),
(8,  'stats_domains',        'Nombre de domaines',          '19',                                                                                  'TEXT', 'HERO',   true, '2024-06-15 10:00:00'),
(9,  'cta_title',            'Titre du CTA',                'Rejoignez la communauté de recherche IA',                                            'TEXT', 'CTA',    true, '2024-01-15 10:00:00'),
(10, 'cta_description',      'Description du CTA',         'Créez votre compte chercheur et contribuez à faire avancer la science en Tunisie.',   'TEXT', 'CTA',    true, '2024-01-15 10:00:00'),
(11, 'cta_button_label',     'Texte bouton CTA',            'Créer mon compte',                                                                   'TEXT', 'CTA',    true, '2024-01-15 10:00:00'),
(12, 'cta_button_url',       'Lien bouton CTA',             '/register',                                                                          'URL',  'CTA',    true, '2024-01-15 10:00:00'),
(13, 'footer_description',   'Description du footer',       'IA Technology – Portail national de la recherche en intelligence artificielle en Tunisie. © 2024 Tous droits réservés.', 'TEXT', 'FOOTER', true, '2024-01-15 10:00:00'),
(14, 'footer_email_contact', 'Email de contact',            'contact@iatechnology.tn',                                                            'TEXT', 'FOOTER', true, '2024-01-15 10:00:00'),
(15, 'footer_phone_contact', 'Téléphone de contact',        '+216 71 000 000',                                                                    'TEXT', 'FOOTER', true, '2024-01-15 10:00:00'),
(16, 'footer_address',       'Adresse',                     'Campus Universitaire Farhat Hached, 2092 Tunis, Tunisie',                             'TEXT', 'FOOTER', true, '2024-01-15 10:00:00'),
(17, 'footer_linkedin_url',  'Lien LinkedIn',               'https://linkedin.com/company/iatechnology-tn',                                      'URL',  'FOOTER', true, '2024-01-15 10:00:00'),
(18, 'footer_twitter_url',   'Lien Twitter/X',              'https://twitter.com/iatechnology_tn',                                                'URL',  'FOOTER', true, '2024-01-15 10:00:00'),
(19, 'about_mission',        'Mission (à propos)',          'Centraliser et valoriser la recherche tunisienne en intelligence artificielle pour promouvoir l''innovation et les collaborations nationales et internationales.', 'HTML', 'HERO', true, '2024-01-15 10:00:00'),
(20, 'maintenance_mode',     'Mode maintenance',            'false',                                                                               'TEXT', 'FOOTER', false,'2024-01-15 10:00:00');

-- ============================================================
-- 11. AUDIT LOGS
-- ============================================================
INSERT INTO audit_logs (id, action, entite, entite_id, utilisateur_email, utilisateur_role, description, adresse_ip, date_action) VALUES
(1,  'LOGIN',    'USER',        NULL, 'admin@iatechnology.tn',    'ADMIN',      'Connexion réussie de l''administrateur',              '196.203.18.1',  '2024-01-15 08:01:00'),
(2,  'CREATE',   'DOMAIN',      1,    'admin@iatechnology.tn',    'ADMIN',      'Création du domaine "Intelligence Artificielle"',     '196.203.18.1',  '2024-01-15 08:05:00'),
(3,  'CREATE',   'RESEARCHER',  1,    'admin@iatechnology.tn',    'ADMIN',      'Création du chercheur Ali Ben Salah',                 '196.203.18.1',  '2024-01-15 08:20:00'),
(4,  'CREATE',   'PUBLICATION', 1,    'admin@iatechnology.tn',    'ADMIN',      'Ajout de la publication "Détection d''anomalies IoT"', '196.203.18.1', '2024-01-15 09:00:00'),
(5,  'LOGIN',    'USER',        NULL, 'mod1@iatechnology.tn',     'MODERATEUR', 'Connexion réussie du modérateur Jean',               '41.228.100.55', '2024-01-20 09:15:00'),
(6,  'CREATE',   'ACTUALITE',   1,    'admin@iatechnology.tn',    'ADMIN',      'Publication de l''actualité "Lancement de la plateforme"','196.203.18.1','2024-01-15 10:00:00'),
(7,  'CREATE',   'HIGHLIGHT',   1,    'admin@iatechnology.tn',    'ADMIN',      'Ajout du highlight BreastNet-TN',                    '196.203.18.1',  '2024-06-10 10:05:00'),
(8,  'UPDATE',   'HOME_CONTENT',6,    'admin@iatechnology.tn',    'ADMIN',      'Mise à jour du compteur de publications (25)',        '196.203.18.1',  '2024-06-15 10:10:00'),
(9,  'LOGIN',    'USER',        NULL, 'ali.ben.salah@gmail.com',  'UTILISATEUR','Connexion de l''utilisateur Ali Ben Salah',           '88.150.22.33',  '2024-02-10 11:05:00'),
(10, 'CREATE',   'PUBLICATION', 2,    'mod1@iatechnology.tn',     'MODERATEUR', 'Publication indexée par le modérateur Jean',          '41.228.100.55', '2024-01-20 09:30:00'),
(11, 'UPDATE',   'RESEARCHER',  3,    'mod2@iatechnology.tn',     'MODERATEUR', 'Mise à jour de l''affiliation du chercheur K. Ferchichi','196.203.15.5','2024-04-01 14:00:00'),
(12, 'DELETE',   'PUBLICATION', NULL, 'admin@iatechnology.tn',    'ADMIN',      'Suppression d''une publication en doublon',           '196.203.18.1',  '2024-03-05 16:30:00'),
(13, 'LOGIN',    'USER',        NULL, 'sonia.maaloul@gmail.com',  'UTILISATEUR','Connexion de l''utilisateur Sonia Maaloul',           '197.15.67.89',  '2024-03-15 10:00:00'),
(14, 'CREATE',   'RESEARCHER',  14,   'admin@iatechnology.tn',    'ADMIN',      'Création du chercheur Nour Abidi',                   '196.203.18.1',  '2024-03-20 09:00:00'),
(15, 'LOGOUT',   'USER',        NULL, 'admin@iatechnology.tn',    'ADMIN',      'Déconnexion de l''administrateur',                   '196.203.18.1',  '2024-06-15 17:00:00');
