const Product = require("../Models/product.model")
const uploadOnCloudinary = require("../Utils/uploadOnCloudinary")

// Helper function to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  return distance
}

const createProduct = async (req, res) => {
  try {
    const { name, category, price, locationData, usedFrom, usedTo, distance, availability } = req.body

    let imageUrl = null

    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.path)
      if (uploadResult) {
        imageUrl = uploadResult.secure_url
      } else {
        return res.status(500).json({ message: "Image upload failed" })
      }
    }

    const existing = await Product.findOne({ name, postedBy: req.userId })
    if (existing) {
      return res.status(400).json({ message: "Product already exists" })
    }

    // Parse locationData if it's a string
    const parsedLocationData = typeof locationData === "string" ? JSON.parse(locationData) : locationData

    const product = new Product({
      name,
      category,
      price,
      location: {
        address: parsedLocationData.address,
        city: parsedLocationData.city,
        state: parsedLocationData.state,
        country: parsedLocationData.country,
        village: parsedLocationData.village,
        district: parsedLocationData.district,
        pincode: parsedLocationData.pincode,
        coordinates: {
          latitude: Number.parseFloat(parsedLocationData.latitude),
          longitude: Number.parseFloat(parsedLocationData.longitude),
        },
      },
      usedFrom,
      usedTo,
      distance,
      availability,
      image: imageUrl,
      postedBy: req.userId,
    })

    await product.save()
    res.status(201).json({ message: "Product created", product })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("postedBy", "name email")
    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getNearbyProducts = async (req, res) => {
  try {
    const { latitude, longitude, radius = 50 } = req.query

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude and longitude are required" })
    }

    const lat = Number.parseFloat(latitude)
    const lng = Number.parseFloat(longitude)
    const radiusInKm = Number.parseFloat(radius)

    const products = await Product.find().populate("postedBy", "name email phoneNo")

    // Filter products by distance and add distance field
    const nearbyProducts = products
      .map((product) => {
        const distance = calculateDistance(
          lat,
          lng,
          product.location.coordinates.latitude,
          product.location.coordinates.longitude,
        )
        return { ...product.toObject(), distanceFromUser: Math.round(distance * 100) / 100 }
      })
      .filter((product) => product.distanceFromUser <= radiusInKm)
      .sort((a, b) => a.distanceFromUser - b.distanceFromUser)

    res.status(200).json(nearbyProducts)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("postedBy", "name email phoneNo")
    if (!product) return res.status(404).json({ message: "Product not found" })
    res.status(200).json(product)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ postedBy: req.userId })
    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const updateProduct = async (req, res) => {
  try {
    const { name, category, price, locationData, usedFrom, usedTo, distance, availability } = req.body

    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: "Product not found" })

    if (product.postedBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to update this product" })
    }

    let imageUrl = product.image

    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.path)
      if (uploadResult) {
        imageUrl = uploadResult.secure_url
      }
    }

    product.name = name || product.name
    product.category = category || product.category
    product.price = price || product.price

    if (locationData) {
      const parsedLocationData = typeof locationData === "string" ? JSON.parse(locationData) : locationData
      product.location = {
        address: parsedLocationData.address,
        city: parsedLocationData.city,
        state: parsedLocationData.state,
        country: parsedLocationData.country,
        village: parsedLocationData.village,
        district: parsedLocationData.district,
        pincode: parsedLocationData.pincode,
        coordinates: {
          latitude: Number.parseFloat(parsedLocationData.latitude),
          longitude: Number.parseFloat(parsedLocationData.longitude),
        },
      }
    }

    product.usedFrom = usedFrom || product.usedFrom
    product.usedTo = usedTo || product.usedTo
    product.distance = distance || product.distance
    product.availability = availability !== undefined ? availability : product.availability
    product.image = imageUrl

    await product.save()
    res.status(200).json({ message: "Product updated", product })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: "Product not found" })

    if (product.postedBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to delete this product" })
    }

    await Product.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: "Product deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const searchByCategory = async (req, res) => {
  try {
    const { category } = req.query
    if (!category) return res.status(400).json({ message: "Category query parameter is required" })

    const products = await Product.find({ category: { $regex: category, $options: "i" } })
    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  getNearbyProducts,
  getProductById,
  getMyProducts,
  updateProduct,
  deleteProduct,
  searchByCategory,
}
