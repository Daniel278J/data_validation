import objval from './images/object-valid.png';
import dataval from './images/data-valid.png';
import storeproc from './images/storeproc-val.png';
import apprem from './images/app-rem.png';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="main-body">
      <div className="work">
        <Link to="/objval" className="blocks" title="Object Validation">
          <img src={objval} alt="Object Validation" />
        </Link>
        <Link to="/dataval" className="blocks" title="Data Validation">
          <img src={dataval} alt="Data Validation" />
        </Link>
        <Link to="/storedproc" className="blocks" title="Stored Procedure Validation">
          <img src={storeproc} alt="Stored Procedure Validation" />
        </Link>
        <Link to="/apprem" className="blocks" title="App Remediation">
          <img src={apprem} alt="App Remediation" />
        </Link>
      </div>
    </div>
  );
}

export default Home;
