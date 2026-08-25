const home = async (req, res) => {
  res.render('index.ejs');
};

const pending = (req, res) => {
  res.render('pending/index.ejs');
};

const rejected = (req, res) => {
  res.render('rejected/index.ejs');
};

module.exports = {
  home,
  pending,
  rejected,
};
