import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/certifications.css";

const certifications = [
  { title: "ISO AS9100D Certificate", text: "ISO 9001:2015 standard is based on a number of quality management principles including a strong customer focus, the motivation and implication of top management, the process approach and continual improvement. These principles are explained in more detail in the pdf Quality Management Principles. Using ISO 9001:2015 helps ensure that customers get consistent, good quality products and services, which in turn brings many business benefits." },
  { title: "ISO 14001:2015 Certificate", text: "ISO 14001:2015 sets out the criteria for an environmental management system and can be certified to. It maps out a framework that a company or organization can follow to set up an effective environmental management system. It can be used by any organization regardless of its activity or sector." }
];

function Certifications(){ return <div className="simple-page"><Navbar/><main className="cert-main">
  {certifications.map((item)=><section className="cert-row" key={item.title}><div><h1>{item.title}</h1><p>{item.text}</p><a href="#credentials">Certificate Credentials</a></div><div className="cert-image"><img src="/images/certificate-1.png" alt="Certificate" onError={(e)=>{e.currentTarget.style.display="none"}}/><span>▣<br/><b>Certificate Image</b></span></div></section>)}
</main><Footer/></div> }
export default Certifications;
