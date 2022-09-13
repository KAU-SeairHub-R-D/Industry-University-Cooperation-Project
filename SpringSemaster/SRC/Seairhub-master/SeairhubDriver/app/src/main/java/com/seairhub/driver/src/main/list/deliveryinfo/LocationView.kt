package com.seairhub.driver.src.main.list.deliveryinfo

import com.seairhub.driver.src.main.list.deliveryinfo.models.NotificationResponse

interface LocationView {
    fun onPostLocationSuccess(response: NotificationResponse)
    fun onPostLocationFailure(message: String)
}