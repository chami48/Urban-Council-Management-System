import React from "react";
import { Facebook, Instagram, Twitter, Linkedin, Youtube, MessageCircle } from "lucide-react";
import "./HoranaCouncilLanding.css";

const HoranaCouncilLanding = () => {
  return (
    <div className="landing">
      {/* Background */}
      <div
        className="landing-bg"
        style={{
          backgroundImage: `
            linear-gradient(rgba(30,41,59,.8), rgba(15,23,42,.9)),
            url('/parliment.webp')
          `,
        }}
      />

      {/* Social Media */}
      <div className="social">
        <div className="social-btn fb"><Facebook size={20} color="#fff" /></div>
        <div className="social-btn ig"><Instagram size={20} color="#fff" /></div>
        <div className="social-btn tw"><Twitter size={20} color="#fff" /></div>
        <div className="social-btn li"><Linkedin size={20} color="#fff" /></div>
        <div className="social-btn yt"><Youtube size={20} color="#fff" /></div>
      </div>

      {/* WhatsApp */}
      <div className="whatsapp">
        <div className="wa-btn"><MessageCircle size={24} color="#fff" /></div>
      </div>

      {/* Main */}
      <div className="main">
        <header className="header">
          <div className="header-row">
            <div className="logo-box">
              <img src="/emblem.svg" alt="Sri Lanka Coat of Arms" />
            </div>

            <div className="titles">
              <h1>හොරණ නගර සභාව - ශ්‍රී ලංකාව</h1>
              <h2>இலங்கை நகர சபை - ஹோரண</h2>
              <h3>HORANA URBAN COUNCIL - SRI LANKA</h3>
            </div>

            <div className="logo-box">
              <img src="/horanalogo.png" alt="Horana Urban Council" />
            </div>
          </div>
        </header>

        <div className="center">
          <div className="grid">
            {/* English */}
            <div className="card">
              <div className="coconut">
                <div className="outer" />
                <div className="ring ring1" />
                <div className="ring ring2" />
                <div className="ring ring3" />
                <div className="ring ring4" />
                <div className="content">
                  <h3>Welcome</h3>
                  <p>
                    Official Horana Urban Council<br />
                    Serving Our Community<br />
                    with Excellence and Integrity
                  </p>
                </div>
              </div>
              <div className="btn-wrap">
                <a href="/mainhome" className="btn-primary">ENGLISH</a>
              </div>
            </div>

            {/* Sinhala */}
            <div className="card">
              <div className="coconut">
                <div className="outer" />
                <div className="ring ring1" />
                <div className="ring ring2" />
                <div className="ring ring3" />
                <div className="ring ring4" />
                <div className="content">
                  <h3>ආයුබෝවන්</h3>
                  <p>
                    ශ්‍රී ලංකා නගර සභාව - හොරණ<br />
                    අපගේ ප්‍රජාවට උසස් ගුණත්වයෙන්<br />
                    සේවා කරන ආයතනයකි
                  </p>
                </div>
              </div>
              <div className="btn-wrap">
                <a href="/mainhome" className="btn-primary">සිංහල</a>
              </div>
            </div>

            {/* Tamil */}
            <div className="card">
              <div className="coconut">
                <div className="outer" />
                <div className="ring ring1" />
                <div className="ring ring2" />
                <div className="ring ring3" />
                <div className="ring ring4" />
                <div className="content">
                  <h3>வணக்கம்</h3>
                  <p>
                    இலங்கை நகர சபை - ஹோரண<br />
                    எங்கள் சமுதாயத்திற்கு சிறந்த<br />
                    சேவையுடன் கூடிய அமைப்பு
                  </p>
                </div>
              </div>
              <div className="btn-wrap">
                <button className="btn-primary">தமிழ்</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default HoranaCouncilLanding;
