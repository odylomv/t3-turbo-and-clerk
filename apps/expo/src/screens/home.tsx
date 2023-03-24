import React from 'react';
import { Button, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@clerk/clerk-expo';
import { FlashList } from '@shopify/flash-list';

import { api, type RouterOutputs } from '../utils/api';

const SignOut = () => {
  const { signOut } = useAuth();
  return <Button onPress={() => void signOut()} title="Sign Out" />;
};

const PostCard: React.FC<{
  post: RouterOutputs['post']['all'][number];
  onDelete: () => void;
}> = ({ post, onDelete }) => {
  return (
    <View className="flex flex-row rounded-lg bg-white/10 p-4">
      <View className="flex-grow">
        <Text className="text-xl font-semibold text-pink-400">{post.title}</Text>
        <Text className="mt-2 text-white">{post.content}</Text>
      </View>
      <TouchableOpacity onPress={onDelete}>
        <Text className="font-bold uppercase text-pink-400">Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const CreatePost: React.FC = () => {
  const utils = api.useContext();

  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');

  const { mutate, error } = api.post.create.useMutation({
    async onSuccess() {
      setTitle('');
      setContent('');
      await utils.post.all.invalidate();
    },
  });

  return (
    <View className="mt-4">
      <TextInput
        className="mb-2 rounded bg-white/10 p-2 text-white"
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
      />
      {error?.data?.zodError?.fieldErrors.title && (
        <Text className="mb-2 text-red-500">{error.data.zodError.fieldErrors.title}</Text>
      )}

      <TextInput
        className="mb-2 rounded bg-white/10 p-2 text-white"
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
        value={content}
        onChangeText={setContent}
        placeholder="Content"
      />
      {error?.data?.zodError?.fieldErrors.content && (
        <Text className="mb-2 text-red-500">{error.data.zodError.fieldErrors.content}</Text>
      )}

      <TouchableOpacity
        className="rounded bg-pink-400 p-2"
        onPress={() => {
          mutate({
            title,
            content,
          });
        }}
      >
        <Text className="font-semibold text-white">Publish post</Text>
      </TouchableOpacity>
    </View>
  );
};

export const HomeScreen = () => {
  const postQuery = api.post.all.useQuery();

  const deletePostMutation = api.post.delete.useMutation({
    onSettled: () => postQuery.refetch(),
  });

  const [showPost, setShowPost] = React.useState<string | null>(null);

  return (
    <SafeAreaView className="bg-[#1F104A]">
      <View className="flex h-full w-full p-4">
        <Text className="mx-auto pb-2 text-5xl font-bold text-white">
          Create <Text className="text-pink-400">T3</Text> Turbo
        </Text>

        <View className="pb-2">
          <SignOut />
        </View>

        <Button onPress={() => void postQuery.refetch()} title="Refresh posts" color={'#f472b6'} />

        <View className="py-2">
          {showPost ? (
            <Text className="text-white">
              <Text className="font-semibold">Selected post: </Text>
              {showPost}
            </Text>
          ) : (
            <Text className="font-semibold italic text-white">Press on a post</Text>
          )}
        </View>

        <View className="flex-grow px-2">
          <FlashList
            data={postQuery.data}
            estimatedItemSize={20}
            ItemSeparatorComponent={() => <View className="h-2" />}
            renderItem={p => (
              <TouchableOpacity onPress={() => setShowPost(p.item.id)}>
                <PostCard post={p.item} onDelete={() => deletePostMutation.mutate(p.item.id)} />
              </TouchableOpacity>
            )}
          />
        </View>

        <CreatePost />
      </View>
    </SafeAreaView>
  );
};
