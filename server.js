import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev_secret_change_me';
const ALLOWED_USERNAME = 'qazwsx1995';
const APP_PASSWORD = process.env.APP_PASSWORD || 'change_me_password';
const SITE_URL = (process.env.SITE_URL || '').replace(/\/$/, '');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    name: 'sid',
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    }
  })
);

function requireAuth(req, res, next) {
  if (req.session && req.session.user === ALLOWED_USERNAME) return next();
  return res.redirect('/login');
}

app.get('/', (req, res) => {
  res.render('index', {
    siteUrl: SITE_URL || '',
    isAuthenticated: req.session && req.session.user === ALLOWED_USERNAME
  });
});

app.get('/login', (req, res) => {
  if (req.session && req.session.user === ALLOWED_USERNAME) return res.redirect('/secure');
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ALLOWED_USERNAME && password === APP_PASSWORD) {
    req.session.user = ALLOWED_USERNAME;
    return res.redirect('/secure');
  }
  return res.status(401).render('login', { error: '用户名或密码不正确' });
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.get('/secure', requireAuth, (req, res) => {
  res.render('secure', { username: ALLOWED_USERNAME });
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  const sitemapUrl = SITE_URL ? `${SITE_URL}/sitemap.xml` : '/sitemap.xml';
  res.send(`User-agent: *\nAllow: /\nDisallow: /secure\nSitemap: ${sitemapUrl}\n`);
});

app.get('/sitemap.xml', (req, res) => {
  const base = SITE_URL || `${req.protocol}://${req.get('host')}`;
  const lastmod = new Date().toISOString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${base}/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>${lastmod}</lastmod>
  </url>
  <url>
    <loc>${base}/login</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <lastmod>${lastmod}</lastmod>
  </url>
</urlset>`;
  res.type('application/xml').send(xml);
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${PORT}`);
});