# ReactGrandRepertoire
## Installer les dépendances.
Il suffit de cloner le projet, et de réaliser la commande "npm i" à la même racine que package.json pour installer les dépendances.
## Tailwind CSS
Tailwind est un framework CSS permettant du faire "inline style" dans l'attribut HTML "class". Je recommande d'installer l'extension Tailwind CSS Intellisense dans 
VS code qui donnera de l'auto-complétion. Ils offrent également une documentation très bien expliquée sur leur site. https://tailwindcss.com/docs/installation

**tailwind.config.js** : ce fichier me permet d'overwrite le style par défaut de Tailwind ou de l'étendre grâce à la propriété "extend". \
J'ai juste ajouté 3 polices depuis Google font (je les importe depuis index.html) et y ai ajouté deux couleurs (gold et cu_yellow -> custom yellow) 

**index.css** : c'est dans ce fichier que l'on peut faire du "custom CSS". Je m'en suis servi surtout pour donner un style par défaut aux inputs désactivés
ou bien pour réaliser des animations ou 2/3 "bidouillages" (Spinner, etc...).

## main.tsx
C'est ici que tout se passe. Il n'y a que 3 balises. 
- "React.StrictMode" (qui sert au développement, il render 2 fois les composants pour être sûr qu'on
ait pas de fuite de mémoire en oubliant de retirer un event listener ou autre.) 
- "BrowserRouter" qui servira à React Route pour son routing
- "App" qui contient toute l'application.

## App.tsx
C'est ici que tout se passe, je lazy load toutes les pages qui se trouvent toutes dans le dossier "page" sauf l'home page. 
<br>
<br>
Il y a un ToastContainer qui me permet de d'envoyer des notifications depuis n'importe où depuis l'application grâce à la class Toast dans le dossier utils. Il ne doit y
avoir qu'un seul ToastContainer dans toute l'application sinon cela engendra des doublons.

### Le layout (se trouve dans le dossier layout)
- "Header" : Il gère la navigation mobile ainsi que la navigation desktop..Et le header. Il sera toujours sur toutes les pages et toujours au dessus.
- "Main" : Le corps principal de la page, c'est là où le routing affiche les pages
- "Footer" : Vide pour le moment mais si on souhaite y rajouter des choses dedans il y est, il sera toujours en bas de la page, même si  le contenu de "main" est vide.

### Le Routing
Comme dit plus haut, je lazy load toutes les pages sauf l'home page. Tant qu'il n'aura pas réussi à lazyload la page demandé il y a un props fallback qui comme son
nom l'indique est un "repli" qui affichera que la page est en train de charger grâce au composant "SpinnerPage" qui est dans le dossier components.

## Rechercher par nombre d'instruments/instrumentistes. (./pages/search/category)
Les autres pages sont faciles à "comprendre". Mais celle-là demande des explications. J'y ai mis des commentaires, mais on va appronfondir.
<br>
<br>
Si on atterit sur l'url simple : "search/category", rien ne se passe, rien n'est affiché, la page attend notre select et le click du bouton rechercher.
<br>
<br>
Mais dès que la recherche commence, l'URL change automatiquement avec des query parameters ◉_◉ : 
"search/category?results_per_page=25&page=1&nbr_instrumentalists=3"
<br>
<br>
Maintenant si l'on arrive sur la page avec ces 3 paramètres précis (via un partage, ou un copié-collé), la page comprend qu'elle doit effectuer une recherche d'elle même
et n'attend pas qu'on appuie sur le bouton rechercher pour effectuer un appel à l'API.
<br>
<br>
Egalement dès qu'une seule recherche a été lancée, au moindre changement (nouvelle sélection du nbr d'instruments, changement de page/de résultats par page, si l'on
veut inclure des orchestres/ensembles avec ou non), la page fera un appel à l'API automatiquement.

### L'appel à l'API
Que se passe-t-il ? 
<br>
<br>
Je mets IsRequestPending à true et les résultats de l'API à null. cela permettra à un composant de render "SkeletonLoader-Foo". Et c'est ce "SkeletonLoader" ( qui est
juste un spinner plus joli...) qui fait un appel à l'API. Une fois la réponse reçue par l'API, je fais appel à un callback passé à ce SkeletonLoader pour mettre à jour
les données, et remettre isRequestPending à false.
<br>
<br>
Une fois les données récupérées DisplayResults mount et affichent les données (Bois(1) - Bois(2) + Cuivres(4), etc...) sous forme de bouton. Si l'on clique sur un bouton
j'affiche un autre composant qui va récupérer les formations précises de la catégorie choisie (FL - 2FL 4TRP, etc...) dans un pop up.
<br>
<br>
Ce pop contient des boutons qui amèneront vers les partitions de la formation choisie.
<br>
<br>
**Exemple plus parlant :**
- J'arrive sur search/category
- Je choisis 6 instruments, j'appuie sur le bouton rechercher
- Les résultats s'affichent avec différentes catégories Bois (6) - Bois (5) + Cuivres (1) - etc...
- Je clique sur Bois (6), un pop up s'affiche avec différentes formations 2PICC FL OB CL FAG - PICC 3FL OB CL - etc..
- Je décide de cliquer sur 2PICC FL OB CL FAG
- Cela m'amène sur une nouvelle page avec toutes les partitions possibles pour 2PICC FL OB CL FAG.

## Comment fonctionne les autres pages ?
A peu près le même principe que pour la recherche par catégorie. Je mets isRequestPending à true et dès qu'on change de page ou qu'on filtre,
un SkeletonLoader s'affiche, et lorsqu'il récupère les données il les passe via un callback au composant principal pour les afficher.

## Les appels à l'API.
Tous les appels à l'api se font dans le dossier "api". L'url de base de l'api se situe dans la class InfoApi. 
<br>
Les requêtes GET & POST se font respectivement dans la class Get et la class Post. Les interfaces concernants l'api se terminent généralement par API à la fin sauf
oubli de ma part.