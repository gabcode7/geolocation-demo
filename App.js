import React from "react";
import MapView, { Callout, Circle, Marker } from "react-native-maps";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { GeofencingEventType } from "expo-location";
import * as TaskManager from "expo-task-manager";

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log("location ", location);
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  //Obtener ubicacion
  async function currentLocation() {
    const newLocation = await Location.getCurrentPositionAsync({});
    return newLocation;
  }
  console.log("location 2", currentLocation());

  //Geofencing
  const regions = {
    identifier: "Parque Arauco",
    latitude: -33.40223816427574,
    longitude: -70.57804555413635,
    radius: 300,
  };
  const geofencing = "geofencing-parque-arauco";

  const geofencingParqueArauco = async () => {
    await Location.startGeofencingAsync(geofencing, regions);
  };

  TaskManager.defineTask(
    geofencing,
    ({ data: { eventType, region }, error }) => {
      if (error) {
        console.log(error);
        return;
      }
      if (eventType === GeofencingEventType.Enter) {
        console.log("You've entered region:", region);
      } else if (eventType === GeofencingEventType.Exit) {
        console.log("You've left region:", region);
      }
    }
  );

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          //-33.402237150937154, -70.57834420576039
          latitude: -33.402237150937154,
          longitude: -70.57834420576039,
          latitudeDelta: 0.0322,
          longitudeDelta: 0.0221,
        }}
      >
        <Marker
          coordinate={{
            latitude: -33.402237150937154,
            longitude: -70.57834420576039,
          }}
        >
          <Callout>
            <Text> Marcador Falabella Parque Arauco!</Text>
          </Callout>
        </Marker>
        <Circle
          center={{
            latitude: -33.402237150937154,
            longitude: -70.57834420576039,
          }}
          radius={300}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
