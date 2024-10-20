
import { SignUp } from "@clerk/nextjs";

export default function HeroSection() {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Left column: Content */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Welcome to Our <span className="text-primary">Amazing Product</span>
            </h1>
            <p className="mt-4 text-xl text-muted-foreground">
              Experience the future of technology with our innovative solution. Boost your productivity and streamline your workflow like never before.
            </p>
          </div>

          {/* Right column: Graphic */}
          <div className="flex items-center justify-center lg:justify-end">
            <SignUp/>
          </div>
        </div>
      </div>
    </div>
  )
}