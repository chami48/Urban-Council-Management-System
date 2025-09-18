import React from "react";
import Nav from "../Nav/Nav"; // your navigation component

import "./contactus.css";

 function ContactUs() {
  return (
    <>
      <Nav />
      <div className="container mt-5">
        <h2 className="text-center mb-4">අමතන්න</h2>

        <div className="accordion" id="contactAccordion">
          {/* Sabah Officials */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
              >
                සභා නිලධාරින්
              </button>
            </h2>
            <div
              id="collapseOne"
              className="accordion-collapse collapse"
              data-bs-parent="#contactAccordion"
            >
              <div className="accordion-body">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>නම</th>
                      <th>දුරකථන අංකය</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>ආරක්ෂක නිලධාරී</td>
                      <td>0112345678</td>
                    </tr>
                    <tr>
                      <td>කාර්ය මණ්ඩල ප්‍රධානියා</td>
                      <td>0118765432</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Various Government Institutions */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingTwo">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTwo"
              >
                සභා විවිධ රාජ්‍ය ආයතන
              </button>
            </h2>
            <div
              id="collapseTwo"
              className="accordion-collapse collapse"
              data-bs-parent="#contactAccordion"
            >
              <div className="accordion-body">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>ආයතනය</th>
                      <th>දුරකථන</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>ග්‍රාම නිලධාරී කාර්යාලය</td>
                      <td>0112233445</td>
                    </tr>
                    <tr>
                      <td>පොලිස් ස්ථානය</td>
                      <td>0119988776</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Various Religious Places */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingThree">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseThree"
              >
                සභා විවිධ ආගමික ස්ථාන
              </button>
            </h2>
            <div
              id="collapseThree"
              className="accordion-collapse collapse"
              data-bs-parent="#contactAccordion"
            >
              <div className="accordion-body">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>ස්ථානය</th>
                      <th>දුරකථන</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>විහාරය</td>
                      <td>0113344556</td>
                    </tr>
                    <tr>
                      <td>දේවස්ථානය</td>
                      <td>0115566778</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContactUs;