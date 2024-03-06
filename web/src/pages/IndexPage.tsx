import { Box } from '@chakra-ui/react';
import HeroSection from '../components/LandingPage/HeroSection';
import InfoSection from '../components/LandingPage/InfoSection';
import NavBar from '../components/LandingPage/NavBar';
import Footer from '../components/LandingPage/Footer';

/**
 *
 * css-gradient: https://cssgradient.io/
 */

const IndexPage = () => {
  return (
    <Box w="100vw" h="100vh" mt="0" m="auto">
      <Box
        maxW="100vw"
        px={{ base: 10, md: 40 }}
        alignItems="center"
        //bgGradient="linear-gradient(45deg, #b8faf480 0%, #a8bdfc80 25%, #c5b0f680 50%, #ffe5f980 75%, #f0ccc380 100%)"
        bgGradient="var(--logoGradient)"
      >
        <NavBar />
        <HeroSection />
        <InfoSection />
      </Box>
      <Footer />
    </Box>
  );
};

export default IndexPage;
