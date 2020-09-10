import React, { Component } from "react";
import {
  View,
  FlatList
} from "react-native";
import {
  Button,
  Icon
} from "native-base";
import CustomText from "../../components/CustomText";
import Requests from "../../api/Requests";
import MessageDialog from "../../components/Dialog";
import Spinner from "../../components/Spinner";
import FeedPost from "../../components/FeedPost";
import StickyPost from "../../components/StickyPost";
import CreatePostModal from "../../components/CreatePostModal";
import Global from "../../constants/Global";

class FeedScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      token: "",
      feedData: [],
      offset: 0,
      refreshing: false,
      stickyPost: "",
    };
  }

  componentDidMount() {
    this.getData();
  }

  getStickyPost = () => {
    /**
     * Retrieves the sticky post to be rendered at the top of the
     * feed
     */
    Requests.retrieveStickyPost(this.state.token)
      .then((response) => {
        if (response.data.success) {
          this.setState({ stickyPost: response.data.data });
        } else {
          this.refs.dialog.showAlert("Error", response.data.message);
          return;
        }
      })
      .catch((error) => {
        if (error.response) {
          this.refs.dialog.showAlert(
            "Whoops!",
            "Something went wrong. Please try again later."
          );
        } else if (error.request) {
          this.refs.dialog.showAlert(
            "Unable to connect with the server",
            "Please check your internet connection and try again."
          );
        } else {
          console.log("Error", error.message);
        }
      });
  };

  getData = async () => {
    this.setState({ token: Global.token }, () => {
      this.getStickyPost();
      this.retrieveInitialFeedData();
      this.checkProfileCompletion();
    });
  };

  checkProfileCompletion = () => {
    Requests.getProfileCompletion(this.state.token)
      .then((response) => {
        if (response.data.success) {
          if (response.data.data.replace("%", "") !== "100") {
            this.refs.dialog.showAlert("", response.data.message);
            this.props.navigation.navigate("MyProfile", {
              screen: "EditProfile",
            });
          }
        } else {
          this.refs.dialog.showAlert("Error", response.data.message);
          return;
        }
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        if (error.response) {
          this.refs.dialog.showAlert(
            "Whoops!",
            "Something went wrong. Please try again later."
          );
        } else if (error.request) {
          this.refs.dialog.showAlert(
            "Unable to connect with the server",
            "Please check your internet connection and try again."
          );
        } else {
          console.log("Error", error.message);
        }
      });
  };

  retrieveInitialFeedData = () => {
    /**
     * Retrieves the first 20 or so posts to be shown.
     * More posts are loaded upon scrolling
     */
    let token = this.state.token;
    this.setState({ isLoading: true, refreshing: false }, () => {
      Requests.retrieveFeed(token)
        .then((response) => {
          if (response.data.success) {
            this.setState({ isLoading: false, feedData: response.data.data });
          } else {
            this.setState({ isLoading: false });
            console.log(response.data.message);
            this.refs.dialog.showAlert("Error", response.data.message);
            return;
          }
        })
        .catch((error) => {
          this.setState({ isLoading: false });
          if (error.response) {
            // Server Error
            // console.log(error.response.data);
            this.refs.dialog.showAlert(
              "Whoops!",
              "Something went wrong. Please try again later."
            );
            // console.log(error.response.status);
            // console.log(error.response.headers);
          } else if (error.request) {
            // Something else that's fucked up happened
            this.refs.dialog.showAlert(
              "Unable to connect with the server",
              "Please check your internet connection and try again."
            );
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
          }
        });
    });
  };

  onScroll = () => {
    /**
     * Retrieves more feed data as the user scrolls and
     * appends it to existing feed data
     */
    this.setState({ offset: this.state.offset + 20 }, () => {
      const { token, offset } = this.state;
      this.setState({ isLoading: false }, () => {
        Requests.retrieveFeedPaginated(token, offset)
          .then((response) => {
            if (response.data.success) {
              this.setState({
                isLoading: false,
                feedData: [...this.state.feedData, ...response.data.data],
              });
            } else {
              this.setState({ isLoading: false });
              console.log(response.data.message);
              this.refs.dialog.showAlert("Error", response.data.message);
              return;
            }
          })
          .catch((error) => {
            this.setState({ isLoading: false });
            if (error.response) {
              // Server Error
              // console.log(error.response.data);
              this.refs.dialog.showAlert(
                "Whoops!",
                "Something went wrong. Please try again later."
              );
              // console.log(error.response.status);
              // console.log(error.response.headers);
            } else if (error.request) {
              // Something else that's fucked up happened
              this.refs.dialog.showAlert(
                "Unable to connect with the server",
                "Please check your internet connection and try again."
              );
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log("Error", error.message);
            }
          });
      });
    });
  };

  render() {
    const { isLoading, feedData, stickyPost } = this.state;

    const renderItem = ({ item }) => (
      <FeedPost content={item} navigation={this.props.navigation} />
    );
    if (isLoading) {
      return <Spinner />;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <FlatList
            ListHeaderComponent={() => <StickyPost content={stickyPost} />}
            data={feedData}
            renderItem={renderItem}
            keyExtractor={(item) => String(item.id)}
            onEndReached={() => {
              this.onScroll();
            }}
            refreshing={this.state.refreshing}
            onRefresh={() => {
              this.setState({ refreshing: true }, () => {
                this.retrieveInitialFeedData();
              });
            }}
          />
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              margin: 5,
              backgroundColor: "transparent",
            }}
          >
            <Button
              block
              transparent
              onPress={() => {
                this.refs.createPostModal.showModal();
              }}
            >
              <Icon
                type="AntDesign"
                name="pluscircleo"
                style={{ color: "deepskyblue" }}
              />
              <CustomText content="Create a post" />
            </Button>
          </View>
          <MessageDialog ref="dialog" />
          <CreatePostModal ref="createPostModal" />
        </View>
      );
    }
  }
}

export default FeedScreen;
