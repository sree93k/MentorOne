import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography, Stack } from '@mui/material';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import {
  faFacebook,
  faTwitter,
  faLinkedin,
  faInstagram,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FooterProps } from '../../types/landing';

const defaultQuickLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Features', href: '/features' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
];

const Footer: React.FC<FooterProps> = ({
  companyName = 'Mentor One',
  socialLinks = {},
  quickLinks = defaultQuickLinks,
  contactInfo = {
    email: 'contact@mentorone.com',
    phone: '091 6282155102',
    address: '123 Mentorship Street, Kinfra Techno Park, Kakkanchery, Kerala 673634',
  },
}) => {
  const SocialIcon = ({ icon, href, label }: { icon: any; href?: string; label: string }) => (
    <Box
      component="a"
      href={href || '#'}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        color: 'grey.400',
        transition: 'color 0.2s',
        '&:hover': {
          color: 'white',
        },
      }}
      aria-label={label}
    >
      <FontAwesomeIcon icon={icon} style={{ width: '20px', height: '20px' }} />
    </Box>
  );

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'black',
        color: 'white',
        pt: 8,
        pb: 4
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <img src="/logo.png" alt={companyName} style={{ height: '40px', width: 'auto' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {companyName}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'grey.400', maxWidth: '90%' }}>
                Empowering mentorship connections and fostering professional growth through our
                innovative platform.
              </Typography>
              <Stack direction="row" spacing={3}>
                {socialLinks.facebook && (
                  <SocialIcon icon={faFacebook} href={socialLinks.facebook} label="Facebook" />
                )}
                {socialLinks.twitter && (
                  <SocialIcon icon={faTwitter} href={socialLinks.twitter} label="Twitter" />
                )}
                {socialLinks.linkedin && (
                  <SocialIcon icon={faLinkedin} href={socialLinks.linkedin} label="LinkedIn" />
                )}
                {socialLinks.instagram && (
                  <SocialIcon icon={faInstagram} href={socialLinks.instagram} label="Instagram" />
                )}
              </Stack>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Quick Links
            </Typography>
            <Grid container spacing={2}>
              {quickLinks.map((link, index) => (
                <Grid item xs={6} key={index}>
                  <Box
                    component={Link}
                    to={link.href}
                    sx={{
                      textDecoration: 'none',
                      color: 'rgba(255,255,255,0.7)',
                      transition: 'color 0.2s',
                      display: 'block',
                      '&:hover': {
                        color: 'white',
                      },
                    }}
                  >
                    {link.label}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Contact Us
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PhoneIcon style={{ width: '20px', height: '20px', color: 'rgba(255,255,255,0.7)' }} />
                <Typography variant="body2" sx={{ color: 'grey.400' }}>
                  {contactInfo.phone}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <EnvelopeIcon style={{ width: '20px', height: '20px', color: 'rgba(255,255,255,0.7)' }} />
                <Typography variant="body2" sx={{ color: 'grey.400' }}>
                  {contactInfo.email}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <MapPinIcon style={{ width: '20px', height: '20px', color: 'rgba(255,255,255,0.7)' }} />
                <Typography variant="body2" sx={{ color: 'grey.400'}}>
                  {contactInfo.address}
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box 
          sx={{ 
            borderTop: '1px solid rgba(255,255,255,0.1)',
            mt: 6,
            pt: 3,
            textAlign: 'center'
          }}
        >
          <Typography variant="body2" sx={{ color: 'grey.400' }}>
            {new Date().getFullYear()} {companyName}. All rights reserved to Sreekuttan N.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;