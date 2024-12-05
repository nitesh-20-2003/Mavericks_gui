import styled from "styled-components";
const Wrapper = styled.section`
  padding: 5rem 0;

  .section-title {
    text-align: center;
    margin-bottom: 4rem;
  }

  .section-center {
    width: 90vw;
    margin: 0 auto;
    max-width: 1170px;
  }

  @media screen and (min-width: 992px) {
    .section-center {
      width: 95vw;
    }
  }

  .about-video,
  .about-info {
    margin-bottom: 2rem;
  }

  @media screen and (min-width: 992px) {
    .about-center {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 2rem;
    }
    .about-video,
    .about-info {
      margin-bottom: 0;
    }
  }

  @media screen and (min-width: 1170px) {
    .about-video::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      border: 0.5rem solid var(--dashboard-border);
      box-sizing: border-box;
      top: -1.5rem;
      left: -1.5rem;
    }

    .about-video {
      position: relative;
    }
    .about-video-content {
      position: relative;
    }
  }
`;
export default Wrapper;