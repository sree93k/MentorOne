import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QuickActions from "@/components/contact/QuickActions";
import SocialMedia from "@/components/contact/SocialMedia";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const ContactPage: React.FC = () => {
  // Office location coordinates (Kinfra Techno Park, Kakkanchery, Kerala)
  const officeLocation: [number, number] = [
    Number(import.meta.env.VITE_OFFICE_LAT) || 11.2588,
    Number(import.meta.env.VITE_OFFICE_LNG) || 75.7804,
  ];

  const contactInfo = {
    email: import.meta.env.VITE_CONTACT_EMAIL || "contact@mentorone.com",
    phone: import.meta.env.VITE_CONTACT_PHONE || "091 6282155102",
    address:
      "123 Mentorship Street, Kinfra Techno Park, Kakkanchery, Kerala 673634",
    hours: "Mon-Sat: 9AM-6PM | Sun: Closed", // ✅ Updated
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Ready to start your mentorship journey? We're here to help you
            connect with the right mentor.
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-16 -mt-10 relative ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Information Cards */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Contact Card */}
              <ContactInfo
                contactInfo={contactInfo}
                officeLocation={officeLocation}
              />
              {/* Social Media Card */}
              <Card className="bg-white dark:bg-gray-800 shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    Follow Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <SocialMedia />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions Card */}

              <QuickActions
                contactInfo={contactInfo}
                officeLocation={officeLocation}
              />
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className=" pt-8 py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Find Our Office
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Visit us at our location in Kinfra Techno Park, Kerala
            </p>
          </div>

          <Card className="overflow-hidden shadow-2xl border-0">
            <div className="h-96 md:h-[500px] w-full">
              <MapContainer
                center={officeLocation}
                zoom={15}
                scrollWheelZoom={false}
                className="h-full w-full rounded-lg"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={officeLocation} icon={customIcon}>
                  <Popup>
                    <div className="text-center p-2">
                      <h3 className="font-bold text-lg text-gray-900">
                        Mentor One
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {contactInfo.address}
                      </p>
                      <div className="mt-3 space-y-1">
                        <p className="text-sm">
                          <strong>Phone:</strong> {contactInfo.phone}
                        </p>
                        <p className="text-sm">
                          <strong>Email:</strong> {contactInfo.email}
                        </p>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of professionals who have transformed their careers
            through our mentorship platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3 text-lg"
            >
              Get Started Today
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-3 text-lg"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
