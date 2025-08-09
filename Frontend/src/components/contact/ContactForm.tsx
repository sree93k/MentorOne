import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-hot-toast";
import { Send, Upload, X } from "lucide-react";
import { submitContactForm } from "@/services/contactServices";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  inquiryType: string;
  message: string;
  preferredContact: string;
  agreeToPrivacy: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const ContactForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    inquiryType: "",
    message: "",
    preferredContact: "email",
    agreeToPrivacy: false,
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.inquiryType) {
      newErrors.inquiryType = "Please select an inquiry type";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    if (!formData.agreeToPrivacy) {
      newErrors.agreeToPrivacy = "You must agree to the privacy policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof ContactFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large. Keep < 50MB");
        return;
      }

      // Check file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
        "text/plain",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file type. Only image, PDF, or text fil");
        return;
      }

      setAttachedFile(file);
    }
  };

  const removeFile = () => {
    setAttachedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Invalid Input");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitContactForm(formData);

      if (result.success) {
        toast.success("Message Sent Successfully! 🎉");
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          inquiryType: "",
          message: "",
          preferredContact: "email",
          agreeToPrivacy: false,
        });
        setAttachedFile(null);
        setErrors({});
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast.error("Please try again later");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-white  dark:bg-gray-800 shadow-xl border-0">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
          Send us a Message
        </CardTitle>
        <p className="text-gray-600 dark:text-gray-400">
          Fill out the form below and we'll get back to you as soon as possible.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name and Email Row */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name *
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`h-12 ${
                  errors.name ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`h-12 ${
                  errors.email ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Phone and Inquiry Type Row */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inquiryType" className="text-sm font-medium">
                Inquiry Type *
              </Label>
              <Select
                value={formData.inquiryType}
                onValueChange={(value) =>
                  handleInputChange("inquiryType", value)
                }
              >
                <SelectTrigger
                  className={`h-12 ${
                    errors.inquiryType ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Select inquiry type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="general">General Inquiry</SelectItem>
                  <SelectItem value="mentorship">Mentorship Program</SelectItem>
                  <SelectItem value="courses">Courses & Training</SelectItem>
                  <SelectItem value="partnership">
                    Partnership Opportunity
                  </SelectItem>
                  <SelectItem value="support">Technical Support</SelectItem>
                  <SelectItem value="feedback">
                    Feedback & Suggestions
                  </SelectItem>
                  <SelectItem value="media">Media & Press</SelectItem>
                </SelectContent>
              </Select>
              {errors.inquiryType && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.inquiryType}
                </p>
              )}
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-medium">
              Subject *
            </Label>
            <Input
              id="subject"
              type="text"
              placeholder="Brief subject of your message"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              className={`h-12 ${
                errors.subject ? "border-red-500 focus:border-red-500" : ""
              }`}
            />
            {errors.subject && (
              <p className="text-sm text-red-500 mt-1">{errors.subject}</p>
            )}
          </div>

          {/* Preferred Contact Method */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Preferred Contact Method
            </Label>
            <Select
              value={formData.preferredContact}
              onValueChange={(value) =>
                handleInputChange("preferredContact", value)
              }
            >
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone Call</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              Message *
            </Label>
            <Textarea
              id="message"
              placeholder="Tell us more about your inquiry..."
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              rows={6}
              className={`resize-none ${
                errors.message ? "border-red-500 focus:border-red-500" : ""
              }`}
            />
            <div className="flex justify-between items-center">
              {errors.message && (
                <p className="text-sm text-red-500">{errors.message}</p>
              )}
              <p className="text-sm text-gray-500 ml-auto">
                {formData.message.length}/500
              </p>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-2 ">
            <Label className="text-sm font-medium">
              Attach File (Optional)
            </Label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.txt"
                />
                <Label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Label>
              </div>

              {attachedFile && (
                <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-md">
                  <span className="text-sm text-blue-700 dark:text-blue-300">
                    {attachedFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Max file size: 5MB. Accepted formats: JPG, PNG, GIF, PDF, TXT
            </p>
          </div>

          {/* Privacy Policy Checkbox */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="privacy"
              checked={formData.agreeToPrivacy}
              onCheckedChange={(checked) =>
                handleInputChange("agreeToPrivacy", checked as boolean)
              }
              className={errors.agreeToPrivacy ? "border-red-500" : ""}
            />
            <div className="space-y-1">
              <Label
                htmlFor="privacy"
                className="text-sm font-medium cursor-pointer"
              >
                I agree to the Privacy Policy and Terms of Service *
              </Label>
              {errors.agreeToPrivacy && (
                <p className="text-sm text-red-500">{errors.agreeToPrivacy}</p>
              )}
              <p className="text-xs text-gray-500">
                We'll never share your information with third parties. Read our{" "}
                <a href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02]"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending Message...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </div>
            )}
          </Button>

          {/* Response Time Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Response Time:</strong> We typically respond within 24
              hours during business days. For urgent matters, please call us
              directly at{" "}
              <a
                href="tel:09162821551"
                className="font-semibold hover:underline"
              >
                091 6282155102
              </a>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
