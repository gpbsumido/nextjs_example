import PhotoPost from "../components/photoPost.tsx"

export default {
  title: "photoPost",
  component: PhotoPost,
  argTypes: { removeImage: { action: "removeImage" } },
}


const Template = (args) => <PhotoPost {...args} />;

const test_removeImage = (test) => {console.log(text + 'dsfds')}

export const Primary = Template.bind({});
Primary.args = {
  key: 1,
  image: 'image on march 22',
  text:'image on march 22',
  date:'2022-02-22',
  onClick: test_removeImage
};

export const Other = Template.bind({});
Other.args = {
  key: 2,
  image: '',
  text:'image on birthday',
  date:'2022-03-22',
  onClick: test_removeImage
};