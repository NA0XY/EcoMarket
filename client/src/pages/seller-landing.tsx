import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Zap, Users, BarChart } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Zap,
    title: "Quick & Easy Setup",
    description: "Get your store up and running in minutes with our intuitive seller dashboard.",
  },
  {
    icon: Users,
    title: "Reach a Targeted Audience",
    description: "Connect with a growing community of eco-conscious buyers actively seeking sustainable products.",
  },
  {
    icon: BarChart,
    title: "Powerful Analytics",
    description: "Track your sales, monitor performance, and gain valuable insights to grow your business.",
  },
];

export default function SellerLandingPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-20 md:py-32 text-center bg-gradient-to-br from-primary/10 via-transparent to-accent/10"
      >
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
            Sell on EcoMarket & Make a Difference
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Join our curated marketplace for sustainable and eco-friendly products. Reach a passionate audience, grow your business, and contribute to a healthier planet.
          </p>
          <Link href="/seller-apply">
            <Button size="lg" className="text-lg px-8 py-6">
              Start Selling Today
            </Button>
          </Link>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card className="text-center h-full">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Sell With Us Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold">Why Sell With Us?</h2>
          </div>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {[
              "Curated marketplace for sustainable products",
              "Access to a niche, eco-conscious customer base",
              "Secure and reliable payment processing with escrow",
              "Low commission fees",
              "Easy-to-use seller dashboard",
              "Contribute to our environmental impact initiatives"
            ].map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start space-x-3"
              >
                <CheckCircle className="w-6 h-6 text-primary mt-1" />
                <p className="text-lg">{point}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Dashed lines connecting the steps */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px border-t-2 border-dashed border-primary/50 -translate-y-12"></div>

            <div className="relative z-10">
              <Card>
                <CardHeader>
                  <CardTitle>1. Apply</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Submit your application and complete our sustainability verification process.</p>
                </CardContent>
              </Card>
            </div>
            <div className="relative z-10">
              <Card>
                <CardHeader>
                  <CardTitle>2. List</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Once approved, set up your storefront and list your eco-friendly products.</p>
                </CardContent>
              </Card>
            </div>
            <div className="relative z-10">
              <Card>
                <CardHeader>
                  <CardTitle>3. Sell & Earn</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Start selling to our community and get paid securely with our escrow system.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Ready to Grow Your Green Business?</h2>
          <Link href="/seller-apply">
            <Button size="lg" className="text-lg px-8 py-6 animate-pulse">
              Become a Seller
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}