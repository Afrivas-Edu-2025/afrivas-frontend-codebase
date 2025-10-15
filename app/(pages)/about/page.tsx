export default function AboutPage() {
  return ( 
    <section id="about-us" className="flex justify-center align-center py-16 md:py-24 dark:bg-gray-800 rounded h-[600px] ">
      <div className="container">
        <h2 className="mb-2 text-3xl font-bold md:text-4xl text-lemon-100">About Us</h2>
        <p className="mb-8 text-muted-foreground">Why Choose Us?</p>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {/* cards */}
          <div className="rounded-lg border p-6 shadow-sm bg-white/50 dark:bg-gray-600/50 backdrop-blur-lg">
            <h3 className="mb-4 text-xl font-bold uppercase">Focus</h3>
            <p className="text-muted-foreground">
              We focus on creating intuitive tools that enhance communication and collaboration in educational settings,
              making it easier for students, parents, and educators to work together toward academic success.
            </p>
          </div>

          {/* cards */}
          <div className="rounded-lg border p-6 shadow-sm bg-white/50 dark:bg-gray-600/50 backdrop-blur-lg">
            <h3 className="mb-4 text-xl font-bold uppercase">Vision</h3>
            <p className="text-muted-foreground">
              Our vision is to transform education through technology, creating a world where every student has the
              support they need to succeed, and where parents and educators can work together seamlessly.
            </p>
          </div>
          {/* cards  */}
          <div className="rounded-lg border p-6 shadow-sm bg-white/50 dark:bg-gray-600/50 backdrop-blur-lg">
            <h3 className="mb-4 text-xl font-bold">Mission</h3>
            <p className="text-muted-foreground">
              Our mission is to provide innovative solutions that bridge the gap between home and school, empowering all
              stakeholders in education to communicate effectively and collaborate productively.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
