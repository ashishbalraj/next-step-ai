"use client";

import { useState } from "react";
import styles from "./ContactContent.module.css";

export default function ContactContent() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    alert("Message sent successfully! (Form not yet connected to backend)");

    setForm({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Contact Us</h1>

        <p className={styles.subtext}>
          Have questions or feedback? We'd love to hear from you.
          Fill out the form below, and our team will get in touch soon.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Name */}
          <label className={styles.label}>Your Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={form.name}
            onChange={handleChange}
            className={styles.input}
            required
          />

          {/* Email */}
          <label className={styles.label}>Your Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            className={styles.input}
            required
          />

          {/* Message */}
          <label className={styles.label}>Your Message</label>
          <textarea
            name="message"
            rows={5}
            placeholder="Type your message..."
            value={form.message}
            onChange={handleChange}
            className={styles.textarea}
            required
          />

          <button type="submit" className={styles.button}>
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}