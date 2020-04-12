import React from "react";
import Title from "../Title";

export default function Contact() {
  return (
    <section className="py-5">
      <div className="row">
        <div className="col-10 mx-auto col-md-6 my-3">
          <Title title="contact us" />
          <form className="mt-5" method="POST" action="https://formspree.io/ziabaaz01@gmail.com">
            <div className="form-group">
              <input
                type="text"
                name="firstName"
                className="form-control"
                placeholder="Please enter your name"
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Please enter your email"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="subject"
                className="form-control"
                placeholder="Please enter subject of email"
              />
            </div>
            <div className="form-group">
              <textarea
                name="message"
                rows="10"
                className="form-control"
                placeholder="Please enter email body"
              />
            </div>
            <div className="form-group mt-3">
              <input
                type="submit"
                value="Send"
                className="form-control bg-primary text-white"
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
