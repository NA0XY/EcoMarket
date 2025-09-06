import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "wouter";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";

const step1Schema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  contactEmail: z.string().email("Invalid email address"),
  website: z.string().url("Invalid URL").optional().or(z.literal('')),
});

const step2Schema = z.object({
  productCategories: z.string().min(5, "Please describe your product categories"),
  sustainabilityPractices: z.string().min(20, "Please describe your sustainability practices in detail"),
});

const step3Schema = z.object({
  agreedToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

const sellerApplicationSchema = step1Schema.merge(step2Schema).merge(step3Schema);

type SellerApplicationForm = z.infer<typeof sellerApplicationSchema>;

const steps = [
  { id: 1, title: "Business Information", schema: step1Schema, fields: ['businessName', 'contactEmail', 'website'] },
  { id: 2, title: "Product & Sustainability", schema: step2Schema, fields: ['productCategories', 'sustainabilityPractices'] },
  { id: 3, title: "Terms & Conditions", schema: step3Schema, fields: ['agreedToTerms'] },
];

export default function SellerApplyPage() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<SellerApplicationForm>({
    resolver: zodResolver(steps[currentStep].schema),
    mode: "onChange",
  });

  const nextStep = async () => {
    const isValid = await form.trigger(steps[currentStep].fields as any);
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const onSubmit = async (data: SellerApplicationForm) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("Seller Application Submitted:", data);
    setIsLoading(false);
    setIsSubmitted(true);
    toast({
      title: "Application Submitted! 🎉",
      description: "We've received your application and will review it within 3-5 business days.",
    });
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-lg mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Thank You for Applying!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Your application to sell on EcoMarket has been successfully submitted. Our team will review your information and get back to you soon.
              </p>
              <Link href="/">
                <Button>Return to Homepage</Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-serif">Become an EcoMarket Seller</CardTitle>
          <CardDescription>
            Complete the application below. Step {currentStep + 1} of {steps.length}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentStep === 0 && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="businessName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Green Innovations Co." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="contactEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Email</FormLabel>
                            <FormControl>
                              <Input placeholder="you@company.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website / Social Media (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="https://your-store.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {currentStep === 1 && (
                     <div className="space-y-4">
                       <FormField
                         control={form.control}
                         name="productCategories"
                         render={({ field }) => (
                           <FormItem>
                             <FormLabel>Product Categories</FormLabel>
                             <FormControl>
                               <Textarea placeholder="Describe the types of products you sell (e.g., handmade soaps, recycled paper notebooks, bamboo toothbrushes)." {...field} />
                             </FormControl>
                             <FormMessage />
                           </FormItem>
                         )}
                       />
                       <FormField
                         control={form.control}
                         name="sustainabilityPractices"
                         render={({ field }) => (
                           <FormItem>
                             <FormLabel>Sustainability Practices</FormLabel>
                             <FormControl>
                               <Textarea placeholder="Tell us what makes your products and business sustainable. Mention materials, production process, packaging, etc." {...field} />
                             </FormControl>
                             <FormMessage />
                           </FormItem>
                         )}
                       />
                     </div>
                  )}

                  {currentStep === 2 && (
                    <FormField
                      control={form.control}
                      name="agreedToTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I agree to the <Link href="/terms" className="text-primary hover:underline">Seller Terms and Conditions</Link>.
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between items-center pt-4">
                <div>
                  {currentStep > 0 && (
                    <Button type="button" variant="outline" onClick={prevStep}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  )}
                </div>

                <div>
                  {currentStep < steps.length - 1 && (
                    <Button type="button" onClick={nextStep}>
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}

                  {currentStep === steps.length - 1 && (
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Submit Application
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}