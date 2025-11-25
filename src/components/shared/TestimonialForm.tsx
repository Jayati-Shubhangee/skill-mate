import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { BaseCrudService } from '@/integrations';
import { Testimonials } from '@/entities';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TestimonialFormProps {
  onSuccess?: () => void;
}

export default function TestimonialForm({ onSuccess }: TestimonialFormProps) {
  const [formData, setFormData] = useState({
    authorName: '',
    authorRole: '',
    testimonialText: '',
    rating: 5
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const testimonial: Testimonials = {
      _id: crypto.randomUUID(),
      authorName: formData.authorName,
      authorRole: formData.authorRole,
      testimonialText: formData.testimonialText,
      rating: formData.rating,
      submissionDate: new Date().toISOString(),
    };

    await BaseCrudService.create('testimonials', testimonial);

    toast({
      title: 'Success!',
      description: 'Your testimonial has been submitted.',
    });

    setFormData({
      authorName: '',
      authorRole: '',
      testimonialText: '',
      rating: 5
    });

    setSubmitting(false);
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-cardbackground rounded-2xl p-6">
      <div>
        <h3 className="font-heading font-bold text-xl text-textprimary mb-4">
          Share Your Experience
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="authorName" className="font-paragraph text-sm font-semibold text-textprimary mb-2 block">
            Your Name
          </Label>
          <Input
            id="authorName"
            value={formData.authorName}
            onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
            required
            placeholder="John Doe"
            className="bg-inputbackground border-inputborder"
          />
        </div>

        <div>
          <Label htmlFor="authorRole" className="font-paragraph text-sm font-semibold text-textprimary mb-2 block">
            Your Role
          </Label>
          <Input
            id="authorRole"
            value={formData.authorRole}
            onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
            required
            placeholder="Full Stack Developer"
            className="bg-inputbackground border-inputborder"
          />
        </div>

        <div>
          <Label htmlFor="testimonialText" className="font-paragraph text-sm font-semibold text-textprimary mb-2 block">
            Your Testimonial
          </Label>
          <Textarea
            id="testimonialText"
            value={formData.testimonialText}
            onChange={(e) => setFormData({ ...formData, testimonialText: e.target.value })}
            required
            placeholder="Share your experience with SkillMate..."
            rows={4}
            className="bg-inputbackground border-inputborder"
          />
        </div>

        <div>
          <Label className="font-paragraph text-sm font-semibold text-textprimary mb-2 block">
            Rating
          </Label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({ ...formData, rating: star })}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= formData.rating
                      ? 'fill-primary text-primary'
                      : 'text-inputborder'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="w-full bg-buttonbackground text-buttonforeground hover:bg-primary/90"
      >
        {submitting ? 'Submitting...' : 'Submit Testimonial'}
      </Button>
    </form>
  );
}
