import Github from "../../assets/images/github-logo.png";
import Linkedin from "../../assets/images/linkedin.png";

const SocialMedia = () => {
  return (
    <div className="flex flex-row">
      <a href="https://linkedin.com/in/mobin-karam-a54114242" target="_blank">
        <div className="flex items-center justify-center flex-row mr-5">
          <img
            src={Linkedin}
            alt="linkedin.com/in/mobin-karam"
            className="w-6 mr-1"
          />
          <h6 className="text-sm">Linkedin</h6>
        </div>
      </a>
      <a href="https://github.com/Mobin-Karam" target="_blank">
        <div className="flex items-center justify-center flex-row ">
          <img src={Github} alt="github.com/Mobin-Karm" className="w-6 mr-1" />
          <h6 className="text-sm">Github</h6>
        </div>
      </a>
    </div>
  );
};

export default SocialMedia;
