import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { DEFAULT_HEALTH_ACTIVITIES } from '../data/healthActivities';
import type { HealthActivity, HealthActivityType } from '../types/game';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import ConfirmationDialog from './ConfirmationDialog';

interface ManageHealthActivitiesDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function ManageHealthActivitiesDialog({ open: externalOpen, onOpenChange }: ManageHealthActivitiesDialogProps) {
  const { state, actions } = useGame();
  const [internalOpen, setInternalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<HealthActivity>({
    id: '',
    name: '',
    description: '',
    healthChange: 0,
    category: 'physical',
    duration: 0,
    icon: '✨'
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [activityToDeleteId, setActivityToDeleteId] = useState<string | null>(null);
  
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  useEffect(() => {
    if (!open) {
      resetForm();
      setIsEditing(null);
    }
  }, [open]);

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      healthChange: 0,
      category: 'physical',
      duration: 0,
      icon: '✨'
    });
  };

  // Convert HealthActivityType to compatible format for the form
  const convertHealthActivityTypeToFormData = (activity: HealthActivityType): HealthActivity => {
    return {
      id: activity.id,
      name: activity.name,
      healthChange: activity.healthChangeAmount,
      category: activity.category,
      duration: activity.duration,
      description: activity.description,
      icon: activity.icon
    };
  };

  // Get all activities in compatible format
  const allActivities = [
    ...DEFAULT_HEALTH_ACTIVITIES.map(convertHealthActivityTypeToFormData),
    ...(state.customHealthActivities || [])
  ];

  const handleEditClick = (activity: HealthActivity) => {
    setFormData(activity);
    setIsEditing(activity.id);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error('Please fill in name and description.');
      return;
    }
    if (formData.healthChange === 0) {
      toast.error('Health change cannot be zero.');
      return;
    }
    if (isEditing) {
      actions.updateHealthActivity(formData);
      toast.success('Health activity updated!', { description: `"${formData.name}" has been updated.` });
    } else {
      const newActivity: HealthActivity = {
        ...formData,
        id: `custom_activity_${crypto.randomUUID()}`
      };
      actions.addHealthActivity(newActivity);
      toast.success('New health activity added!', { description: `"${newActivity.name}" has been added.` });
    }
    resetForm();
    setIsEditing(null);
  };

  const handleDeleteClick = (activityId: string) => {
    setActivityToDeleteId(activityId);
    setConfirmDialogOpen(true);
  };

  const confirmDelete = () => {
    if (activityToDeleteId) {
      actions.removeHealthActivity(activityToDeleteId);
      toast.success('Activity deleted.');
      if (isEditing === activityToDeleteId) {
        resetForm();
        setIsEditing(null);
      }
      setActivityToDeleteId(null);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gradient-to-br from-gray-900 to-zinc-800 border-gray-700 text-white max-w-2xl rounded-xl shadow-2xl shadow-purple-950/50">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl font-bold">Manage Health Activities</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-400">{isEditing ? 'Edit Activity' : 'Add New Activity'}</h3>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <Label htmlFor="name" className="text-gray-300">Name</Label>
                  <Input id="name" value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} className="bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div>
                  <Label htmlFor="description" className="text-gray-300">Description</Label>
                  <Textarea id="description" value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} className="bg-gray-800 border-gray-600 text-white min-h-[60px] focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div>
                  <Label htmlFor="healthChange" className="text-gray-300">Health Change</Label>
                  <Input id="healthChange" type="number" value={formData.healthChange} onChange={e => setFormData(prev => ({ ...prev, healthChange: parseInt(e.target.value) || 0 }))} className="bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div>
                  <Label htmlFor="category" className="text-gray-300">Category</Label>
                  <Select value={formData.category} onValueChange={value => setFormData(prev => ({ ...prev, category: value as HealthActivity['category'] }))}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600 text-white">
                      <SelectItem value="physical">Physical</SelectItem>
                      <SelectItem value="mental">Mental</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration" className="text-gray-300">Duration (minutes)</Label>
                  <Input id="duration" type="number" value={formData.duration} onChange={e => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))} className="bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div>
                  <Label htmlFor="icon" className="text-gray-300">Icon (Emoji or Text)</Label>
                  <Input id="icon" value={formData.icon} onChange={e => setFormData(prev => ({ ...prev, icon: e.target.value }))} className="bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  {isEditing && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button type="button" variant="outline" onClick={() => { resetForm(); setIsEditing(null); }} className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-gray-800 shadow-md shadow-gray-900/30">
                        Cancel Edit
                      </Button>
                    </motion.div>
                  )}
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button type="submit" className="bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-900/50">
                      {isEditing ? 'Update Activity' : 'Add Activity'}
                    </Button>
                  </motion.div>
                </div>
              </form>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-400">Your Activities</h3>
              <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {allActivities.length === 0 ? (
                  <p className="text-gray-400 text-sm">No activities defined yet. Add some!</p>
                ) : (
                  allActivities.map(activity => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between p-3 mb-2 bg-gray-800 border border-gray-700 rounded-lg shadow-md shadow-gray-950/30"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{activity.icon}</span>
                        <div>
                          <div className="font-medium text-gray-100">{activity.name}</div>
                          <div className="text-xs text-gray-400">
                            {activity.healthChange > 0 ? '+' : ''}{activity.healthChange} HP
                            {activity.duration > 0 && ` • ${activity.duration}m`}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button size="sm" variant="outline" onClick={() => handleEditClick(activity)} className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-gray-800 shadow-md shadow-gray-900/30">
                            <Edit size={14} />
                          </Button>
                        </motion.div>
                        {activity.id.startsWith('custom_activity_') && (
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteClick(activity.id)} className="shadow-md shadow-red-900/30">
                              <Trash2 size={14} />
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <ConfirmationDialog
        open={confirmDialogOpen}
        setOpen={setConfirmDialogOpen}
        title="Confirm Deletion"
        description="Are you sure you want to delete this activity? This action cannot be undone."
        onConfirm={confirmDelete}
        confirmText="Delete"
      />
    </>
  );
}

export default ManageHealthActivitiesDialog;
