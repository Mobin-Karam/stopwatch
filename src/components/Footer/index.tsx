const Footer = () => {
  return (
    <header className="flex items-center justify-center bg-orange-300 p-2 text-xl font-bold">
      <main className="main" id="main">
        <div className="main__content">
          <div className="main__social-icons">
            <a
              href="https://linkedin.com/in/mobin-karam-a54114242"
              target="_blank"
            >
              <div className="icon-bg">
                <img
                  src="../../assets/images/github-logo.png"
                  alt="linkedin.com/in/mobin-karam"
                />
                <h4>Linkedin</h4>
              </div>
            </a>

            <a href="https://github.com/Mobin-Karam" target="_blank">
              <div className="icon-bg">
                <img
                  src="../../assets/images/github-logo.png"
                  alt="github.com/Mobin-Karm"
                />
                <h4>Github</h4>
              </div>
            </a>
          </div>
        </div>
      </main>
    </header>
  );
};

export default Footer;
