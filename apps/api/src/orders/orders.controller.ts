import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { OrdersService } from "./orders.service.js";
import type {
  AcceptOrderByCourierInput,
  CreateOrderInput,
  SendOrderMessageInput,
  UpdateCourierStepInput,
  UpdateOrderKitchenStageInput,
} from "@coconea/types";

@Controller("orders")
export class OrdersController {
  constructor(
    @Inject(OrdersService) private readonly ordersService: OrdersService,
  ) {}

  @Get()
  list(@Query("restaurantId") restaurantId?: string) {
    return { data: this.ordersService.listAll(restaurantId) };
  }

  @Get(":id")
  getById(@Param("id") id: string) {
    return { data: this.ordersService.getById(id) };
  }

  @Post()
  create(@Body() body: CreateOrderInput) {
    return { data: this.ordersService.createOrder(body) };
  }

  @Patch(":id/kitchen-stage")
  updateKitchenStage(
    @Param("id") id: string,
    @Body() body: UpdateOrderKitchenStageInput,
  ) {
    return {
      data: this.ordersService.updateKitchenStage(id, body.kitchenStage),
    };
  }

  @Post(":id/accept-courier")
  acceptCourier(
    @Param("id") id: string,
    @Body() body: AcceptOrderByCourierInput,
  ) {
    return {
      data: this.ordersService.acceptByCourier(id, body.courier),
    };
  }

  @Post(":id/reject-courier")
  rejectCourier(
    @Param("id") id: string,
    @Body() body: { courierId: string },
  ) {
    return {
      data: this.ordersService.rejectByCourier(id, body.courierId),
    };
  }

  @Patch(":id/courier-step")
  updateCourierStep(
    @Param("id") id: string,
    @Body() body: UpdateCourierStepInput,
  ) {
    return {
      data: this.ordersService.updateCourierStep(id, body.courierStep, {
        deliveryPin: body.deliveryPin,
        courierLocation: body.courierLocation,
      }),
    };
  }

  @Post(":id/messages")
  addMessage(@Param("id") id: string, @Body() body: SendOrderMessageInput) {
    return {
      data: this.ordersService.addMessage(
        id,
        body.senderRole,
        body.senderName,
        body.text,
      ),
    };
  }
}
