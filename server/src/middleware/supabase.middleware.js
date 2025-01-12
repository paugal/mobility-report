// mobility-report/server/src/middleware/supabase.middleware.js
const supabaseMiddleware = (supabase) => (req, res, next) => {
  req.supabase = supabase;
  next();
};

module.exports = supabaseMiddleware;
