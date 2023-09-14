import Header from "components/Header";
import './_style.scss';

function MainLayout({ children , history }) {

  return (
    <div className="main">
      <Header />
      <div className="w-full mt-14">
        {children}
      </div>
    </div>
  );
}

export default MainLayout;
