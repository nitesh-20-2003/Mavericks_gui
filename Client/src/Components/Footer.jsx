import { pageLinks, socialLinks } from "../utils/data";
import PageLinks from "./PageLinks";
import SocialLink from "./SocialLink";
import Wrapper from "../assets/Wrappers/Footer";
const Footer = () => {
  return (
    <Wrapper>
      <footer className="section footer">
        <PageLinks parentClass="footer-links" itemClass="footer-link" />
        <ul className="footer-icons">
          {socialLinks.map((link) => {
            return (
              <SocialLink key={link.id} {...link} itemClass="footer-icon" />
            );
          })}
        </ul>
        <p className="copyright">
          copyright &copy; Backroads travel tours company
          <span id="date">{new Date().getFullYear()}</span>. all rights reserved
        </p>
      </footer>
    </Wrapper>
  );
};
export default Footer;
