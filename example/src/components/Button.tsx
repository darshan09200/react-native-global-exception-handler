import {
  Text,
  TouchableOpacity,
  StyleSheet,
  type TextStyle,
} from 'react-native';

type Props = React.ComponentProps<typeof TouchableOpacity> & {
  label: string;
  textStyle?: TextStyle;
};

const Button = ({ label, textStyle, style, ...props }: Props) => {
  return (
    <TouchableOpacity
      style={[styles.button, StyleSheet.flatten(style)]}
      {...props}
    >
      <Text style={[styles.buttonText, StyleSheet.flatten(textStyle)]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Button;
