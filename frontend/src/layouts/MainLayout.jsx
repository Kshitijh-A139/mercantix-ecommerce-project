import Navbar from '../components/Navbar/Navbar';

const MainLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

export default MainLayout;