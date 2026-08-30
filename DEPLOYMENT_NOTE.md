Deployment Source Of Truth

- Live site process uses Passenger Node app root: /home/sergbcqk/garden
- Local mirror for that app root: c:/gardenwithserge-website/garden
- Live static assets are served from: c:/gardenwithserge-website/garden/public

Update these files for frontend changes:

- c:/gardenwithserge-website/garden/public/index.html
- c:/gardenwithserge-website/garden/public/app.js
- c:/gardenwithserge-website/garden/public/translations.js

Do not deploy from duplicate legacy tree:

- c:/gardenwithserge-website/gardenwithserge.com/public_STALE_COPY_DO_NOT_DEPLOY

Operational reminder:

- After uploading changes, restart Passenger app in cPanel and hard refresh browser.