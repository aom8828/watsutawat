const WatMap = () => {
  return (
    <div className="w-full md:w-[80%] mx-auto mt-10">
      <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-lg">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242.23715462798873!2d100.89021188203826!3d13.730889545452495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f30.5!3m3!1m2!1s0x311d6962a9d23faf%3A0x19cb3f275dde6f66!2z4Lin4Lix4LiU4Liq4Li44LiX4LiY4Liy4Lin4Liy4LiqIOC4ieC4sOC5gOC4iuC4tOC4h-C5gOC4l-C4o-C4sg!5e0!3m2!1sth!2sth!4v1743856337941!5m2!1sth!2sth"
          width="100%"
          height="100%"
          style={{ border: 0, position: "absolute", top: 0, left: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default WatMap;
