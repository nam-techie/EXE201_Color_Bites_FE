'use client'

import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import {
   Alert,
   SafeAreaView,
   ScrollView,
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from 'react-native'

const moods = ['😋', '🔥', '❤️', '😍', '🤤', '👌', '💯', '🎉']
const suggestedHashtags = ['#ComfortFood', '#Delicious', '#FoodieLife', '#Yummy', '#LocalEats']

export default function CreatePostScreen() {
   const [caption, setCaption] = useState('')
   const [selectedMood, setSelectedMood] = useState('')
   const [location, setLocation] = useState('')
   const [hashtags, setHashtags] = useState<string[]>([])
   const [isPrivate, setIsPrivate] = useState(false)
   const [selectedImage, setSelectedImage] = useState<string | null>(null)

   const pickImage = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
         allowsEditing: true,
         aspect: [4, 3],
         quality: 1,
      })

      if (!result.canceled) {
         setSelectedImage(result.assets[0].uri)
      }
   }

   const addHashtag = (tag: string) => {
      if (!hashtags.includes(tag)) {
         setHashtags([...hashtags, tag])
      }
   }

   const removeHashtag = (tag: string) => {
      setHashtags(hashtags.filter((h) => h !== tag))
   }

   const handleShare = () => {
      Alert.alert('Success', 'Post shared successfully!')
   }

   return (
      <SafeAreaView style={styles.container}>
         {/* Header */}
         <View style={styles.header}>
            <View style={styles.headerContent}>
               <Text style={styles.headerTitle}>Create Post</Text>
               <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
                  <Text style={styles.shareButtonText}>Share</Text>
               </TouchableOpacity>
            </View>
         </View>

         <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            {/* Image Upload */}
            <View style={styles.section}>
               {selectedImage ? (
                  <View style={styles.imageContainer}>
                     <Image
                        source={{ uri: selectedImage }}
                        style={styles.selectedImage}
                        contentFit="cover"
                     />
                     <TouchableOpacity
                        onPress={() => setSelectedImage(null)}
                        style={styles.removeImageButton}
                     >
                        <Ionicons name="close" size={16} color="white" />
                     </TouchableOpacity>
                  </View>
               ) : (
                  <TouchableOpacity onPress={pickImage} style={styles.imageUploadArea}>
                     <Ionicons name="camera" size={48} color="#9CA3AF" />
                     <Text style={styles.imageUploadText}>Add photos or videos</Text>
                     <View style={styles.chooseMediaButton}>
                        <Ionicons name="add" size={16} color="#6B7280" />
                        <Text style={styles.chooseMediaText}>Choose Media</Text>
                     </View>
                  </TouchableOpacity>
               )}
            </View>

            {/* Caption */}
            <View style={styles.section}>
               <Text style={styles.sectionLabel}>Caption</Text>
               <TextInput
                  placeholder="Share your food experience..."
                  value={caption}
                  onChangeText={setCaption}
                  multiline
                  numberOfLines={4}
                  style={styles.captionInput}
                  textAlignVertical="top"
                  placeholderTextColor="#9CA3AF"
               />
            </View>

            {/* Mood Selection */}
            <View style={styles.section}>
               <Text style={styles.sectionLabel}>How was it?</Text>
               <View style={styles.moodContainer}>
                  {moods.map((mood) => (
                     <TouchableOpacity
                        key={mood}
                        onPress={() => setSelectedMood(mood)}
                        style={[
                           styles.moodButton,
                           selectedMood === mood && styles.selectedMoodButton,
                        ]}
                     >
                        <Text style={styles.moodEmoji}>{mood}</Text>
                     </TouchableOpacity>
                  ))}
               </View>
            </View>

            {/* Location */}
            <View style={styles.section}>
               <Text style={styles.sectionLabel}>Location</Text>
               <View style={styles.locationInputContainer}>
                  <Ionicons name="location-outline" size={16} color="#9CA3AF" />
                  <TextInput
                     placeholder="Add location..."
                     value={location}
                     onChangeText={setLocation}
                     style={styles.locationInput}
                     placeholderTextColor="#9CA3AF"
                  />
               </View>
            </View>

            {/* Hashtags */}
            <View style={styles.section}>
               <Text style={styles.sectionLabel}>Hashtags</Text>

               {/* Selected Hashtags */}
               {hashtags.length > 0 && (
                  <View style={styles.selectedHashtagsContainer}>
                     {hashtags.map((tag) => (
                        <View key={tag} style={styles.selectedHashtag}>
                           <Text style={styles.selectedHashtagText}>{tag}</Text>
                           <TouchableOpacity
                              onPress={() => removeHashtag(tag)}
                              style={styles.removeHashtagButton}
                           >
                              <Ionicons name="close" size={12} color="#6B7280" />
                           </TouchableOpacity>
                        </View>
                     ))}
                  </View>
               )}

               {/* Suggested Hashtags */}
               <Text style={styles.suggestedLabel}>Suggested:</Text>
               <View style={styles.suggestedHashtagsContainer}>
                  {suggestedHashtags.map((tag) => (
                     <TouchableOpacity
                        key={tag}
                        onPress={() => addHashtag(tag)}
                        disabled={hashtags.includes(tag)}
                        style={[
                           styles.suggestedHashtag,
                           hashtags.includes(tag) && styles.disabledHashtag,
                        ]}
                     >
                        <Text style={styles.suggestedHashtagText}>#{tag.slice(1)}</Text>
                     </TouchableOpacity>
                  ))}
               </View>
            </View>

            {/* Privacy Settings */}
            <View style={styles.section}>
               <View style={styles.privacyContainer}>
                  <View style={styles.privacyTextContainer}>
                     <Text style={styles.privacyTitle}>Private Post</Text>
                     <Text style={styles.privacySubtitle}>Only visible to your friends</Text>
                  </View>
                  <TouchableOpacity
                     onPress={() => setIsPrivate(!isPrivate)}
                     style={styles.toggleContainer}
                  >
                     <View style={[styles.toggleTrack, isPrivate && styles.toggleTrackActive]}>
                        <View style={[styles.toggleThumb, isPrivate && styles.toggleThumbActive]} />
                     </View>
                  </TouchableOpacity>
               </View>
            </View>

            {/* Premium Features */}
            <View style={styles.premiumSection}>
               <View style={styles.premiumHeader}>
                  <View>
                     <Text style={styles.premiumTitle}>Premium Features</Text>
                     <Text style={styles.premiumSubtitle}>Unlock with Premium</Text>
                  </View>
                  <View style={styles.proBadge}>
                     <Text style={styles.proBadgeText}>PRO</Text>
                  </View>
               </View>
               <View style={styles.premiumFeatures}>
                  <Text style={styles.premiumFeatureText}>• Add videos (5-15s)</Text>
                  <Text style={styles.premiumFeatureText}>• Premium themes & stickers</Text>
                  <Text style={styles.premiumFeatureText}>• Private group sharing</Text>
               </View>
               <TouchableOpacity style={styles.upgradeButton}>
                  <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
               </TouchableOpacity>
            </View>
         </ScrollView>
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#F9FAFB',
   },
   header: {
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 16,
      paddingVertical: 12,
   },
   headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
   headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#111827',
   },
   shareButton: {
      borderRadius: 8,
      backgroundColor: '#F97316',
      paddingHorizontal: 16,
      paddingVertical: 8,
   },
   shareButtonText: {
      fontWeight: '500',
      color: '#FFFFFF',
   },
   scrollView: {
      flex: 1,
   },
   scrollContent: {
      padding: 16,
   },
   section: {
      marginBottom: 16,
      borderRadius: 8,
      backgroundColor: '#FFFFFF',
      padding: 16,
   },
   sectionLabel: {
      marginBottom: 8,
      fontSize: 14,
      fontWeight: '500',
      color: '#111827',
   },
   imageContainer: {
      position: 'relative',
   },
   selectedImage: {
      height: 192,
      width: '100%',
      borderRadius: 8,
   },
   removeImageButton: {
      position: 'absolute',
      right: 8,
      top: 8,
      borderRadius: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: 8,
   },
   imageUploadArea: {
      alignItems: 'center',
      borderRadius: 8,
      borderWidth: 2,
      borderColor: '#D1D5DB',
      borderStyle: 'dashed',
      padding: 32,
   },
   imageUploadText: {
      marginBottom: 8,
      marginTop: 8,
      color: '#6B7280',
   },
   chooseMediaButton: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 8,
      backgroundColor: '#F3F4F6',
      paddingHorizontal: 16,
      paddingVertical: 8,
   },
   chooseMediaText: {
      marginLeft: 8,
      color: '#4B5563',
   },
   captionInput: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      padding: 12,
      fontSize: 14,
      minHeight: 100,
      color: '#111827',
   },
   moodContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 12,
   },
   moodButton: {
      marginBottom: 8,
      marginRight: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 12,
      paddingVertical: 8,
   },
   selectedMoodButton: {
      borderColor: '#F97316',
      backgroundColor: '#F97316',
   },
   moodEmoji: {
      fontSize: 18,
   },
   locationInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      paddingHorizontal: 12,
      paddingVertical: 8,
   },
   locationInput: {
      marginLeft: 8,
      flex: 1,
      fontSize: 14,
      color: '#111827',
   },
   selectedHashtagsContainer: {
      marginBottom: 12,
      flexDirection: 'row',
      flexWrap: 'wrap',
   },
   selectedHashtag: {
      marginBottom: 8,
      marginRight: 8,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 20,
      backgroundColor: '#F3F4F6',
      paddingHorizontal: 12,
      paddingVertical: 4,
   },
   selectedHashtagText: {
      fontSize: 14,
      color: '#111827',
   },
   removeHashtagButton: {
      marginLeft: 4,
   },
   suggestedLabel: {
      marginBottom: 8,
      fontSize: 12,
      color: '#6B7280',
   },
   suggestedHashtagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
   },
   suggestedHashtag: {
      marginBottom: 8,
      marginRight: 8,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 12,
      paddingVertical: 4,
   },
   disabledHashtag: {
      backgroundColor: '#F3F4F6',
   },
   suggestedHashtagText: {
      marginLeft: 4,
      fontSize: 14,
      color: '#111827',
   },
   privacyContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
   privacyTextContainer: {
      flex: 1,
   },
   privacyTitle: {
      fontSize: 14,
      fontWeight: '500',
      color: '#111827',
   },
   privacySubtitle: {
      fontSize: 12,
      color: '#6B7280',
   },
   toggleContainer: {
      marginLeft: 16,
   },
   toggleTrack: {
      height: 24,
      width: 48,
      borderRadius: 12,
      backgroundColor: '#D1D5DB',
      justifyContent: 'center',
      paddingHorizontal: 2,
   },
   toggleTrackActive: {
      backgroundColor: '#F97316',
   },
   toggleThumb: {
      height: 20,
      width: 20,
      borderRadius: 10,
      backgroundColor: '#FFFFFF',
      alignSelf: 'flex-start',
   },
   toggleThumbActive: {
      alignSelf: 'flex-end',
   },
   premiumSection: {
      marginBottom: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#FED7AA',
      backgroundColor: '#FFF7ED',
      padding: 16,
   },
   premiumHeader: {
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
   premiumTitle: {
      fontSize: 14,
      fontWeight: '500',
      color: '#9A3412',
   },
   premiumSubtitle: {
      fontSize: 12,
      color: '#EA580C',
   },
   proBadge: {
      borderRadius: 4,
      backgroundColor: '#F97316',
      paddingHorizontal: 8,
      paddingVertical: 4,
   },
   proBadgeText: {
      fontSize: 12,
      fontWeight: '500',
      color: '#FFFFFF',
   },
   premiumFeatures: {
      marginBottom: 12,
   },
   premiumFeatureText: {
      fontSize: 14,
      color: '#C2410C',
      marginBottom: 4,
   },
   upgradeButton: {
      marginTop: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#FDBA74',
      paddingHorizontal: 16,
      paddingVertical: 8,
   },
   upgradeButtonText: {
      textAlign: 'center',
      fontSize: 14,
      fontWeight: '500',
      color: '#EA580C',
   },
})
