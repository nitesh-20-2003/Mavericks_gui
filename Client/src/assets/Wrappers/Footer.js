import styled from "styled-components";
const Wrapper = styled.section`
  .footer {
    background: var(--clr-grey-1);
    text-align: center;
    padding-left: 2rem;
    padding-right: 2rem;
  }
  .section {
    padding: 5rem 0;
    scroll-margin-top: 4rem;
  }
  .footer-links,
  .footer-icons {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }
  .footer-link {
    color: var(--clr-white);
    text-transform: capitalize;
    font-size: 1rem;
    margin-right: 1rem;
    letter-spacing: var(--spacing);
    transition: var(--transition);
  }
  .footer-link:hover {
    color: var(--clr-primary-5);
  }
  .footer-icon {
    font-size: 2rem;
    margin-right: 1rem;
    color: var(--clr-white);
    transition: var(--transition);
  }
  .footer-icon:hover {
    color: var(--clr-primary-5);
  }
  .copyright {
    text-transform: capitalize;
    letter-spacing: var(--spacing);
    color: var(--clr-white);
  }
  .copyright span {
    margin-left: 0.5rem;
  }
`;
export default Wrapper;