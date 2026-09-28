// index.js
// Air-gapped exercise monitoring dashboard — app bootstrap.
// Talks to a PostgreSQL server that MUST NOT be modified and must see
// negligible load: a tiny connection pool, short statement timeouts,
// and simple indexed-lookup queries only. No writes are ever issued.

const path = require('path');
const express = require('express');
const cors = require('cors');

const { getConfig } = require('./config/config');
const { buildPool, startHealthLoop } = require('./db/pool');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Bootstrap DB pool + health loop using the already-loaded config
// (config/config.js reads config.json at require time).
buildPool(getConfig());
startHealthLoop(getConfig());

// Mount routes
app.use(require('./routes/systemStats'));
app.use(require('./routes/dbStatus'));
app.use(require('./routes/exercises'));
app.use(require('./routes/exerciseSummary'));
app.use(require('./routes/roster'));
app.use(require('./routes/config'));
app.use(require('./routes/queryTest'));
app.use(require('./routes/serviceReset'));
app.use(require('./routes/exercisePdf'));
app.use(require('./routes/hitHistory'));
app.use(require('./routes/llmChat'));
app.use(require('./routes/stats'));

app.listen(PORT, () => {
  console.log(`Simulation monitoring dashboard listening on port ${PORT}`);
});

