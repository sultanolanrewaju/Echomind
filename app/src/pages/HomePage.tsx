import "../styles/index.layout.css";
import SiteHero from "../components/SiteHero";
import SiteFooter from "../layouts/SiteFooter";
import SiteHeader from "../layouts/SiteHeader";
import SiteFeatures from "../components/SiteFeatures";
import SiteSupport from "../components/SiteSupport";
import SiteFeeling from "../components/SiteFeeling";
import Preloader from "../components/Preloader";
import useAPI from "../store/useAPI";

const HomePage = () => {
  const { isCreatingUser } = useAPI();
  return (
    <>
      {isCreatingUser && <Preloader />}
      <SiteHeader />
      <SiteHero />
      <SiteFeatures />
      <SiteSupport />
      <SiteFeeling />
      <SiteFooter />
    </>
  );
};

export default HomePage;
