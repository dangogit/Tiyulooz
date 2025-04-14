import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGuides } from '../../../hooks/use-guides';
import { colors } from '../../../constants/colors';
import { Download, Share2, ArrowLeft, Calendar, User } from 'lucide-react-native';
import Markdown from 'react-native-markdown-display';

export default function GuideDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getGuideById, downloadGuide } = useGuides();
  const [guide, setGuide] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const guideData = getGuideById(id);
      setGuide(guideData);
      setIsLoading(false);
    }
  }, [id]);

  const handleDownload = () => {
    if (guide) {
      downloadGuide(guide.id);
    }
  };

  const handleShare = async () => {
    if (guide) {
      try {
        await Share.share({
          message: `בדוק את המדריך הזה: ${guide.title} - ${guide.description}`,
        });
      } catch (error) {
        console.error('Error sharing guide:', error);
      }
    }
  };

  if (isLoading || !guide) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>טוען מדריך...</Text>
      </View>
    );
  }

  const markdownStyles = {
    body: {
      fontFamily: 'Heebo-Regular',
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
      textAlign: 'right',
    },
    heading1: {
      fontFamily: 'Heebo-Bold',
      fontSize: 24,
      color: colors.text,
      marginBottom: 16,
      marginTop: 24,
      textAlign: 'right',
    },
    heading2: {
      fontFamily: 'Heebo-Bold',
      fontSize: 20,
      color: colors.text,
      marginBottom: 12,
      marginTop: 20,
      textAlign: 'right',
    },
    heading3: {
      fontFamily: 'Heebo-Bold',
      fontSize: 18,
      color: colors.text,
      marginBottom: 8,
      marginTop: 16,
      textAlign: 'right',
    },
    paragraph: {
      marginBottom: 16,
      textAlign: 'right',
    },
    list_item: {
      marginBottom: 8,
      textAlign: 'right',
    },
    bullet_list: {
      marginBottom: 16,
    },
    ordered_list: {
      marginBottom: 16,
    },
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: guide.image }} style={styles.image} />
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.white} style={styles.backIcon} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.title}>{guide.title}</Text>
          <Text style={styles.description}>{guide.description}</Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <User size={16} color={colors.textLight} />
              <Text style={styles.metaText}>{guide.author}</Text>
            </View>
            <View style={styles.metaItem}>
              <Calendar size={16} color={colors.textLight} />
              <Text style={styles.metaText}>{new Date(guide.date).toLocaleDateString('he-IL')}</Text>
            </View>
          </View>
          
          <View style={styles.tagsContainer}>
            {guide.tags.map((tag: string, index: number) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.divider} />
          
          <Markdown style={markdownStyles}>
            {guide.content}
          </Markdown>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.footerButton, styles.downloadButton]}
          onPress={handleDownload}
        >
          <Download size={20} color={colors.white} />
          <Text style={styles.footerButtonText}>
            {guide.isOffline ? 'הורד שוב' : 'הורד למצב לא מקוון'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.footerButton, styles.shareButton]}
          onPress={handleShare}
        >
          <Share2 size={20} color={colors.primary} />
          <Text style={[styles.footerButtonText, styles.shareButtonText]}>שתף</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Heebo-Medium',
    fontSize: 16,
    color: colors.textLight,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 250,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    transform: [{ scaleX: -1 }], // Flip icon for RTL
  },
  content: {
    padding: 16,
  },
  title: {
    fontFamily: 'Heebo-Bold',
    fontSize: 24,
    color: colors.text,
    marginBottom: 8,
    textAlign: 'right',
  },
  description: {
    fontFamily: 'Heebo-Regular',
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 16,
    textAlign: 'right',
  },
  metaContainer: {
    flexDirection: 'row-reverse',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginLeft: 16,
  },
  metaText: {
    fontFamily: 'Heebo-Regular',
    fontSize: 14,
    color: colors.textLight,
    marginRight: 4,
  },
  tagsContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: colors.grayLight,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
    marginBottom: 8,
  },
  tagText: {
    fontFamily: 'Heebo-Medium',
    fontSize: 12,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  footerButton: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  downloadButton: {
    backgroundColor: colors.primary,
    marginRight: 8,
  },
  shareButton: {
    backgroundColor: colors.grayLight,
    marginLeft: 8,
  },
  footerButtonText: {
    fontFamily: 'Heebo-Medium',
    fontSize: 16,
    color: colors.white,
    marginRight: 8,
  },
  shareButtonText: {
    color: colors.primary,
  },
});