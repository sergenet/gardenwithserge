'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),server=fs.readFileSync(path.join(root,'server.js'),'utf8'),dashboard=fs.readFileSync(path.join(root,'admin-dashboard.html'),'utf8');
test('admin console and data require authentication',()=>{assert.match(server,/app\.get\('\/admin', adminLimiter, requireAdminAuth/);assert.match(server,/app\.get\('\/api\/admin\/summary', adminLimiter, requireAdminAuth/);assert.match(dashboard,/noindex,nofollow,noarchive/)});
test('traffic analytics store keyed hashes and aggregates',()=>{assert.match(server,/createHmac\('sha256', ANALYTICS_HASH_SECRET\)/);assert.match(server,/CREATE TABLE IF NOT EXISTS site_metrics_daily/);assert.match(server,/CREATE TABLE IF NOT EXISTS site_visitors_daily/)});
test('summary does not select subscriber emails',()=>{const route=server.slice(server.indexOf("app.get('/api/admin/summary'"),server.indexOf("app.get('/admin/billing-requests'"));assert.doesNotMatch(route,/SELECT\s+email/i)});
