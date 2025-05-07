'use client';

import React from 'react';
import { format } from 'date-fns';
import { User, PhoneCall, Briefcase, Activity } from 'lucide-react';
import { Worker } from '@/types/worker';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ViewWorkerDialogProps {
  open: boolean;
  onClose: () => void;
  worker: Worker;
}

export default function ViewWorkerDialog({
  open,
  onClose,
  worker,
}: ViewWorkerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6 rounded-xl">
        <DialogHeader className="pb-4 border-b mb-6">
          <DialogTitle className="text-2xl font-bold">Worker Details</DialogTitle>
          <DialogDescription className="text-base mt-2 text-muted-foreground">
            View worker information
          </DialogDescription>
        </DialogHeader>

        <Accordion type="multiple" defaultValue={["basic", "contact", "employment", "status"]} className="w-full space-y-4">
          {/* Basic Information */}
          <AccordionItem value="basic" className="border rounded-lg overflow-hidden shadow-sm">
            <AccordionTrigger className="px-4 py-3 text-base font-medium bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-primary" />
                <span>Basic Information</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 px-4 pb-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">First Name</div>
                  <div className="font-medium">{worker.firstName}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Last Name</div>
                  <div className="font-medium">{worker.lastName}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Employee ID</div>
                  <div className="font-medium">{worker.externalId || '-'}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Date of Birth</div>
                  <div className="font-medium">
                    {worker.dateOfBirth ? format(new Date(worker.dateOfBirth), 'MMMM d, yyyy') : '-'}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Gender</div>
                  <div className="font-medium">
                    {worker.gender ? worker.gender.charAt(0).toUpperCase() + worker.gender.slice(1).replace('_', ' ') : '-'}
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Tags</div>
                  {worker.tags && worker.tags.length > 0 ? (
                    <div className="flex gap-2 flex-wrap">
                      {worker.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="py-1 px-2">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="font-medium">-</div>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Contact Information */}
          <AccordionItem value="contact" className="border rounded-lg overflow-hidden shadow-sm">
            <AccordionTrigger className="px-4 py-3 text-base font-medium bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex items-center">
                <PhoneCall className="h-5 w-5 mr-2 text-primary" />
                <span>Contact Information</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 px-4 pb-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Phone Number</div>
                  <div className="font-medium">{worker.contact?.primaryPhoneNumber || '-'}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Email Address</div>
                  <div className="font-medium">{worker.contact?.emailAddress || '-'}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">City</div>
                  <div className="font-medium">{worker.contact?.locationCity || '-'}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">State</div>
                  <div className="font-medium">{worker.contact?.locationStateProvince || '-'}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Country</div>
                  <div className="font-medium">{worker.contact?.locationCountry || '-'}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Preferred Language</div>
                  <div className="font-medium">
                    {worker.contact?.preferredLanguage === 'en-IN' ? 'English' :
                     worker.contact?.preferredLanguage === 'hi' ? 'Hindi' :
                     worker.contact?.preferredLanguage === 'mr' ? 'Marathi' :
                     worker.contact?.preferredLanguage === 'gu' ? 'Gujarati' :
                     worker.contact?.preferredLanguage === 'bn' ? 'Bengali' :
                     worker.contact?.preferredLanguage === 'ta' ? 'Tamil' :
                     worker.contact?.preferredLanguage === 'te' ? 'Telugu' :
                     worker.contact?.preferredLanguage === 'kn' ? 'Kannada' :
                     worker.contact?.preferredLanguage === 'ml' ? 'Malayalam' :
                     worker.contact?.preferredLanguage || '-'}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">WhatsApp Opt-in Status</div>
                  <div className="font-medium">
                    {worker.contact?.whatsappOptInStatus === 'opted_in' ? 'Opted In' :
                     worker.contact?.whatsappOptInStatus === 'opted_out' ? 'Opted Out' :
                     worker.contact?.whatsappOptInStatus === 'pending' ? 'Pending' :
                     worker.contact?.whatsappOptInStatus === 'failed' ? 'Failed' :
                     '-'}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Employment Information */}
          <AccordionItem value="employment" className="border rounded-lg overflow-hidden shadow-sm">
            <AccordionTrigger className="px-4 py-3 text-base font-medium bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-primary" />
                <span>Employment Information</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 px-4 pb-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Job Title</div>
                  <div className="font-medium">{worker.employment?.jobTitle || '-'}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Department</div>
                  <div className="font-medium">{worker.employment?.department || '-'}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Team</div>
                  <div className="font-medium">{worker.employment?.team || '-'}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Hire Date</div>
                  <div className="font-medium">
                    {worker.employment?.hireDate ? format(new Date(worker.employment.hireDate), 'MMMM d, yyyy') : '-'}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Employment Type</div>
                  <div className="font-medium">
                    {worker.employment?.employmentType === 'full_time' ? 'Full Time' :
                     worker.employment?.employmentType === 'part_time' ? 'Part Time' :
                     worker.employment?.employmentType === 'contractor' ? 'Contractor' :
                     worker.employment?.employmentType === 'temporary' ? 'Temporary' :
                     '-'}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Status Information */}
          <AccordionItem value="status" className="border rounded-lg overflow-hidden shadow-sm">
            <AccordionTrigger className="px-4 py-3 text-base font-medium bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-primary" />
                <span>Status</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 px-4 pb-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Active Status</div>
                  <div className="font-medium">{worker.isActive ? 'Active' : 'Inactive'}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Employment Status</div>
                  <div className="font-medium">
                    {worker.employment?.employmentStatus === 'active' ? 'Active' :
                     worker.employment?.employmentStatus === 'inactive' ? 'Inactive' :
                     worker.employment?.employmentStatus === 'on_leave' ? 'On Leave' :
                     worker.employment?.employmentStatus === 'terminated' ? 'Terminated' :
                     '-'}
                  </div>
                </div>

                {!worker.isActive && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Deactivation Reason</div>
                    <div className="font-medium">
                      {worker.deactivationReason ? worker.deactivationReason.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase()) : '-'}
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <DialogFooter className="pt-4 border-t mt-6">
          <Button 
            type="button" 
            onClick={onClose}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 