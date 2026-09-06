import { Link } from "react-router-dom";
import "../styles/footer.css";
import { Phone, Mail, MapPin } from "lucide-react";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-contact">
          <h3>Contact Us</h3>

          <a href="tel:+14255020717">
            <Phone size={18} />
            <span>(425) 502 0717</span>
          </a>

          <a href="mailto:sales@ospreyfasteners.com">
            <Mail size={18} />
            <span>sales@ospreyfasteners.com</span>
          </a>

          <div className="footer-address">
            <MapPin size={18} className="location-icon" />

            <p>
              Osprey Fasteners, Osprey
              <br />
              Lane, Fastener Block,
              <br />
              Plano, California 98108
            </p>
          </div>
        </div>

        <div className="footer-column">
          <h3>Bolts</h3>

          <Link to="/products?category=Bolts">
            HEX HEAD BOLT
          </Link>

          <Link to="/products?category=Bolts">
            HEAVY HEX HEAD CAP
          </Link>

          <h3 className="footer-subhead">Studs</h3>

          <Link to="/products?category=Studs">
            FULL THREAD STUD
          </Link>

          <Link to="/products?category=Studs">
            DOUBLE END STUD
          </Link>

          <Link to="/products?category=Studs">
            THREADED ROD
          </Link>
        </div>

        <div className="footer-column">
          <h3>Nuts</h3>

          <Link to="/products/nuts">
            HEX NUTS
          </Link>

          <Link to="/products/nuts">
            HEAVY HEX NUTS
          </Link>

          <Link to="/products/nuts">
            JAM NUTS
          </Link>

          <Link to="/products/nuts">
            SELF LOCKING NUT
          </Link>

          <h3 className="footer-subhead">Set Screws</h3>

          <Link to="/products?category=Set%20Screws">
            Hex Socket Set Screw
          </Link>
        </div>

        <div className="footer-column">
          <h3>Bolts</h3>

          <Link to="/products?category=Screws">
            SOCKET HEAD CAP SCREW
          </Link>

          <Link to="/products?category=Screws">
            FLAT HEAD CAP SCREW
          </Link>

          <Link to="/products?category=Screws">
            SOCKET HEAD SHOULDER SCREW
          </Link>

          <h3 className="footer-subhead">Process</h3>

          <Link to="/products">
            SELF LOCKING PATCH
          </Link>

          <Link to="/products">
            PELLET OR STRIP (MIL-DTL-18240)
          </Link>
        </div>

      </div>

      {/* 
      <div className="footer-bottom">
        © 2026 Osprey Fasteners. All rights reserved.
      </div>
      */}

    </footer>
  );
}

export default Footer;