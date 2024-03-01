import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Alert,
  Pressable,
  TextInput,
  Image,
  Modal,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    genre: "",
    img: "",
  });
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/books")
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  const keyExtractor = (item) =>
    item && item.id ? item.id.toString() : Math.random().toString();

  const handleDeleteBook = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/books/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {

        setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
      } else {
        Alert.alert("Error", "No se pudo eliminar el libro.");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      Alert.alert("Error", "No se pudo eliminar el libro.");
    }
  };

  const handleUpdateBook = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/books/${selectedBook.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newBook),
        }
      );

      if (response.ok) {
        fetch("http://localhost:3000/books")
          .then((response) => response.json())
          .then((data) => setBooks(data))
          .catch((error) => console.error("Error fetching books:", error));

        setNewBook({ title: "", author: "", genre: "", img: "" });
        setSelectedBook(null);
        setModalVisible(false);
      } else {
        Alert.alert("Error", "No se pudo actualizar el libro.");
      }
    } catch (error) {
      console.error("Error updating book:", error);
      Alert.alert("Error", "No se pudo actualizar el libro.");
    }
  };

  const handleCreateBook = async () => {
    try {
      const response = await fetch("http://localhost:3000/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBook),
      });

      if (response.ok) {
        fetch("http://localhost:3000/books")
          .then((response) => response.json())
          .then((data) => setBooks(data))
          .catch((error) => console.error("Error fetching books:", error));

        setNewBook({ title: "", author: "", genre: "", img: "" });
      } else {
        Alert.alert("Error", "No se pudo crear el libro.");
      }
    } catch (error) {
      console.error("Error creating book:", error);
      Alert.alert("Error", "No se pudo crear el libro.");
    }
  };

  const handleImagePress = (book) => {
    setSelectedBook(book);
    setShowUpdateForm(true);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your books:</Text>
      <FlatList
        data={books}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <Pressable onPress={() => handleImagePress(item)}>
              <Image source={{ uri: item.img }} style={styles.bookImage} />
            </Pressable>
            <View style={styles.buttonContainer}>
              <Pressable onPress={() => handleDeleteBook(item.id)}>
                <Text style={styles.deleteButton}>Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setShowCreateForm(false);
          setShowUpdateForm(false);
          setModalVisible(false);
        }}
      >
        <ScrollView contentContainerStyle={styles.modalContainer}>
          {selectedBook && (
            <>
              <Image
                source={{ uri: selectedBook.img }}
                style={styles.modalImage}
              />
              <Text style={styles.modalText}>Title: {selectedBook.title}</Text>
              <Text style={styles.modalText}>
                Author: {selectedBook.author}
              </Text>
              <Text style={styles.modalText}>Genre: {selectedBook.genre}</Text>

              {showUpdateForm && (
                <View style={styles.formContainer}>
                  <Text style={styles.formTitle}>Update book:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Title"
                    value={newBook.title}
                    onChangeText={(text) =>
                      setNewBook({ ...newBook, title: text })
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Author"
                    value={newBook.author}
                    onChangeText={(text) =>
                      setNewBook({ ...newBook, author: text })
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Genre"
                    value={newBook.genre}
                    onChangeText={(text) =>
                      setNewBook({ ...newBook, genre: text })
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Image URL"
                    value={newBook.img}
                    onChangeText={(text) =>
                      setNewBook({ ...newBook, img: text })
                    }
                  />
                  <Pressable onPress={handleUpdateBook}>
                    <Text style={styles.button}>Update</Text>
                  </Pressable>
                </View>
              )}

              <View style={styles.modalButtonContainer}>
                <Pressable
                  onPress={() => {
                    setShowCreateForm(false);
                    setShowUpdateForm(false); 
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.button}>Close</Text>
                </Pressable>
              </View>
            </>
          )}
        </ScrollView>
      </Modal>

      {showCreateForm && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Add new book:</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={newBook.title}
            onChangeText={(text) => setNewBook({ ...newBook, title: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Author"
            value={newBook.author}
            onChangeText={(text) => setNewBook({ ...newBook, author: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Genre"
            value={newBook.genre}
            onChangeText={(text) => setNewBook({ ...newBook, genre: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Image URL"
            value={newBook.img}
            onChangeText={(text) => setNewBook({ ...newBook, img: text })}
          />

  
          <Pressable onPress={handleCreateBook}>
            <Text style={styles.button}>Add book</Text>
          </Pressable>
        </View>
      )}

   
      <Pressable onPress={() => setShowCreateForm(!showCreateForm)}>
        <Text style={styles.button}>
          {showCreateForm ? "Hide" : "Add book"}{" "}
        </Text>
      </Pressable>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  title: {
    fontSize: 20,
  },
  bookItem: {
    marginBottom: 10,
    padding: 10,
    borderColor: "#ccc",
  },
  deleteButton: {
    color: "red",
    padding: 3,
    borderWidth: 1,
    borderRadius: 2,
    borderStyle: "solid",
    borderColor: "red",
    marginTop: 10,
  },
  updateButton: {
    color: "blue",
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalImage: {
    width: 200,
    height: 200,
    resizeMode: "cover",
    marginTop: 10,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  formContainer: {
    marginTop: 20,
  },
  formTitle: {
    paddingBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: "#5e68c4",
    borderRadius: 5,
    color: "white",
    padding: 10,
    textAlign: "center",
    marginTop: 20,
  },
  bookImage: {
    width: 200,
    height: 200,
    resizeMode: "cover",
    marginTop: 10,
    borderRadius: 5,
  },
});
